<?php


class LocationModel {
    private $db;

    public function __construct() {
        $this->db = \App\Core\Database::getInstance();
    }

    public function getAllLocations() {
        $stmt = $this->db->query("SELECT * FROM locations");
        return $stmt->fetchAll();
    }
}
?>
