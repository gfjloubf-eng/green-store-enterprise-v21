
CREATE TABLE IF NOT EXISTS produce (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  aliases TEXT,
  type TEXT,
  short TEXT,
  emoji TEXT,
  description TEXT,
  sugar_g REAL,
  fat_g REAL,
  acids TEXT,
  vitamins TEXT,
  potassium_high INTEGER DEFAULT 0,
  iron_high INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sample 40 inserts (عينة) ------------------------------------------------
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('موز (Banana)','موز','فاكهة','موز يمني ناضج','🍌','الموز مصدر غني بالطاقة، يحتوي على سكريات طبيعية، وبوتاسيوم وفيتامينات.',12,0.3,'قليل','B6,C',1,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('رمان (Pomegranate)','رمان','فاكهة','رمان يمني','🍎','الرمان يحتوي مضادات أكسدة قوية ومفيد للهضم والقلب.',13,0.4,'معتدل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('تمر (Dates)','تمر','فاكهة','تمر صنف يمني','🍯','التمر مصدر مركز للسكريات والحديد والألياف.',63,0.4,'قليل','B3,K',1,1);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('تفاح (Apple)','تفاح','فاكهة','تفاح يمني محلي','🍏','التفاح غني بالألياف ويقلل من مخاطر بعض الأمراض المزمنة.',10,0.2,'معتدل','C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('طماطم (Tomato)','طماطم,بندورة','خضار','طماطم يمني','🍅','الطماطم غنية بالليكوبين وفيتامين C.',3.9,0.2,'معتدل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('خيار (Cucumber)','خيار','خضار','خيار يمني','🥒','الخيار مرطِّب ومنخفض السعرات.',1.7,0.1,'قليل','K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('مولخية (Molokhia)','مولخية','خضار','ورق مولخية','🥬','مولخية ورقية غنية بالحديد والفيتامينات.',0.5,0.5,'قليل','A,C,K',0,1);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('مانجو (Mango)','مانجو','فاكهة','مانجو يمني','🥭','المانجو حلوة ولها فيتامينات أ وC.',14,0.6,'معتدل','A,C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('ليمون (Lemon)','ليمون','فاكهة','ليمون يمني','🍋','الليمون غني بحمض الستريك وفيتامين C.',2.5,0.1,'مرتفع','C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('بطاط (Potato)','بطاط','خضار','بطاط يمني','🥔','البطاط غني بالنشويات ويستخدم كطعام أساسي.',0.8,0.1,'قليل','C,B6',1,0);

-- +30 (جديد) ---------------------------------------------------------------
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('تين (Fig)','تين','فاكهة','تين يمني','🍈','التين غني بالألياف والمعادن مثل الكالسيوم والمغنيسيوم.',16.3,0.3,'قليل','K,B6',1,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('عنب (Grapes)','عنب','فاكهة','عنب يمني','🍇','العنب مصدر جيد لمضادات الأكسدة والسعرات من السكريات الطبيعية.',16.3,0.2,'معتدل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('جوافة (Guava)','جوافة','فاكهة','جوافة محلية','🥭','الجوافة غنية بفيتامين C والألياف، مفيدة للمناعة والهضم.',8.9,0.6,'معتدل','C,A',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('بابايا (Papaya)','بابايا','فاكهة','بابايا','🍈','البابايا تساعد على الهضم وتحتوي على إنزيمات مفيدة كالباباين.',7.8,0.1,'معتدل','A,C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('مشمش (Apricot)','مشمش','فاكهة','مشمش يمني','🍑','المشمش غني بفيتامين A والألياف، مفيد للبصر والجلد.',9.2,0.4,'قليل','A,C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('خوخ (Peach)','خوخ','فاكهة','خوخ طري','🍑','الخوخ غني بالألياف ومضادات الأكسدة، قليل السعرات.',8.4,0.2,'قليل','A,C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('كمثرى (Pear)','كمثرى','فاكهة','كمثرى محلية','🍐','الكمثرى مصدر جيد للألياف والفيتامينات.',10,0.1,'معتدل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('برتقال (Orange)','برتقال','فاكهة','برتقال يمني','🍊','البرتقال مصدر ممتاز لفيتامين C ومضادات الأكسدة.',9,0.2,'معتدل','C,B1',1,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('يوسفي (Mandarin)','يوسفي,ماندارين','فاكهة','يوسفي','🍊','اليوسفي حلو وسهل الأكل ومصدر لفيتامين C.',10.6,0.3,'معتدل','C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('جريب فروت (Grapefruit)','جريب','فاكهة','جريب فروت','🍊','الجريب فروت منخفض في السعرات ويحتوي على فيتامين C ومركبات مفيدة.',6.9,0.1,'معتدل','C,A',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('أفوكادو (Avocado)','أفوكادو','فاكهة','أفوكادو غني بالدهون الصحية','🥑','الأفوكادو غني بالدهون الصحية وفيتامينات ومعادن مهمة.',0.7,15,'قليل','E,K,C',1,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('باذنجان (Eggplant)','باذنجان','خضار','باذنجان يمني','🍆','الباذنجان غني بالألياف ومضادات أكسدة.',3.5,0.2,'قليل','B1,B6',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('بامية (Okra)','بامية','خضار','بامية','🥬','البامية تحتوي أليافاً ومواد مخاطية مفيدة للهضم.',1.5,0.2,'قليل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('سبانخ (Spinach)','سبانخ','خضار','سبانخ طازج','🥬','السبانخ غني بالحديد والفيتامينات A وC وK.',0.4,0.4,'قليل','A,C,K',1,1);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('جزر (Carrot)','جزر','خضار','جزر','🥕','الجزر غني بالبيتاكاروتين وفيتامين A.',4.7,0.2,'قليل','A,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('شمندر (Beetroot)','شمندر,بنجر','خضار','شمندر','🥕','الشمندر يحتوي على نترات طبيعية تدعم أداء القلب.',6.8,0.2,'قليل','C,B9',1,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('بصل (Onion)','بصل','خضار','بصل محلي','🧅','البصل مصدر لمركبات الكبريت ومفيد للمناعة.',4.2,0.1,'قليل','C,B6',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('ثوم (Garlic)','ثوم','خضار','ثوم','🧄','الثوم مضاد حيوي طبيعي وله فوائد قلبية.',1,0.5,'قليل','B6,C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('فلفل حار (Chili Pepper)','فلفل','خضار','فلفل حار','🌶️','مصدر جيد لفيتامين C والكابسيسين المفيد.',5.3,0.4,'قليل','C,A',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('كزبرة (Coriander)','كزبرة,قزبرة','خضار','كزبرة طازجة','🌿','عشب عطري غني بالفيتامينات والمعادن.',0.9,0.5,'قليل','A,C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('بقدونس (Parsley)','بقدونس','خضار','بقدونس','🌿','البقدونس غني بفيتامين C والحديد وبعض المعادن.',0.9,0.8,'قليل','C,K',0,1);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('ملفوف (Cabbage)','ملفوف,كرنب','خضار','ملفوف','🥬','الكرنب منخفض السعرات وغني بالفيتامينات.',3.2,0.1,'قليل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('قرنبيط (Cauliflower)','قرنبيط','خضار','قرنبيط','🥦','قرنبيط بديل منخفض الكربوهيدرات وغني بالفيتامينات.',1.9,0.3,'قليل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('بروكلي (Broccoli)','بروكلي','خضار','بروكلي','🥦','مصدر مركبات مضادة للسرطان وفيتامين C وK.',1.7,0.4,'قليل','C,K,A',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('فاصوليا خضراء (Green Beans)','فاصوليا','خضار','فاصوليا','🫛','غنية بالألياف والبروتين النباتي.',3.3,0.1,'قليل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('بازيلاء (Peas)','بازيلاء','خضار','بازيلاء طازجة','🟢','البازيلاء غنية بالبروتين والألياف.',5.7,0.4,'قليل','C,K',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('بطاطا حلوة (Sweet Potato)','بطاطا حلوة','خضار','بطاطا حلوة','🍠','غنية بالبيتاكاروتين والألياف.',4.2,0.1,'قليل','A,C',1,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('يقطين (Pumpkin)','يقطين','خضار','يقطين','🎃','اليقطين منخفض السعرات وغني بفيتامين A.',2.8,0.1,'قليل','A,C',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('كوسة (Zucchini)','كوسة','خضار','كوسة','🥒','منخفضة السعرات وغنية بالماء والفيتامينات.',2.5,0.3,'قليل','C,A',0,0);
INSERT INTO produce (name,aliases,type,short,emoji,description,sugar_g,fat_g,acids,vitamins,potassium_high,iron_high) VALUES ('لوبيا (Yardlong bean)','لوبيا','خضار','لوبيا','🟩','نوع من الفاصوليا يستخدم كخضار غني بالألياف.',3.6,0.2,'قليل','C,K',0,0);

