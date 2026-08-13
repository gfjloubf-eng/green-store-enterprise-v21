<?php
namespace App\Core;

use PDO;
use PDOException;
use App\Exceptions\DatabaseException;

class Database
{
    private static ?Database $instance = null;
    private ?PDO $connection = null;

    private function __construct()
    {
        $this->connect();
    }

    /**
     * منع الاستنساخ للحفاظ على الـ Singleton
     */
    private function __clone() {}

    /**
     * منع إلغاء الاستنساخ (unserialize)
     */
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize singleton");
    }

    /**
     * الحصول على نسخة الـ Singleton
     */
    public static function getInstance(): Database
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * إنشاء الاتصال بناءً على الإعدادات
     */
    public function connect(): void
    {
        if ($this->connection !== null) {
            return;
        }

        $config = require __DIR__ . '/../../config/database.php';
        
        // دعم لتعدد قواعد البيانات مستقبلاً (حالياً mysql)
        $driver = $config['connection'] ?? 'mysql';
        $host = $config['host'] ?? '127.0.0.1';
        $port = $config['port'] ?? '3306';
        $db = $config['database'] ?? '';
        $user = $config['username'] ?? 'root';
        $pass = $config['password'] ?? '';
        
        $dsn = "{$driver}:host={$host};port={$port};dbname={$db};charset=utf8mb4";
        
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // إدارة الأخطاء بشكل صارم
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // إعداد الـ Fetch Mode
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci, time_zone = '+00:00'", // إعداد الـ Charset والـ TimeZone
        ];

        try {
            $this->connection = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            // تسجيل الخطأ داخلياً ورمي استثناء مخصص لعدم كشف بيانات الاتصال
            error_log("Database Connection Error: " . $e->getMessage());
            throw new DatabaseException("فشل الاتصال بقاعدة البيانات. الرجاء المحاولة لاحقاً.");
        }
    }

    /**
     * الحصول على كائن الـ PDO (يُستخدم للتوافق وتدريجياً سيتم إخفاؤه)
     */
    public function getConnection(): ?PDO
    {
        return $this->connection;
    }

    public function isConnected(): bool
    {
        return $this->connection !== null;
    }

    public function beginTransaction(): bool
    {
        return $this->connection->beginTransaction();
    }

    public function commit(): bool
    {
        return $this->connection->commit();
    }

    public function rollback(): bool
    {
        return $this->connection->rollBack();
    }

    public function inTransaction(): bool
    {
        return $this->connection->inTransaction();
    }

    public function prepare(string $query)
    {
        try {
            return $this->connection->prepare($query);
        } catch (PDOException $e) {
            error_log("Database Prepare Error: " . $e->getMessage());
            throw new DatabaseException("حدث خطأ أثناء تحضير الاستعلام.");
        }
    }

    public function query(string $query)
    {
        try {
            return $this->connection->query($query);
        } catch (PDOException $e) {
            error_log("Database Query Error: " . $e->getMessage());
            throw new DatabaseException("حدث خطأ أثناء تنفيذ الاستعلام.");
        }
    }

    public function execute(string $query, array $params = [])
    {
        try {
            $stmt = $this->connection->prepare($query);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Database Execute Error: " . $e->getMessage());
            throw new DatabaseException("حدث خطأ أثناء تنفيذ الاستعلام.");
        }
    }

    public function lastInsertId(?string $name = null): string|false
    {
        return $this->connection->lastInsertId($name);
    }
}
