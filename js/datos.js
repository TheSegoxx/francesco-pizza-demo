/* ============================================================
   DATOS DEL LOCAL · editá acá precios, platos y horarios
   ============================================================ */
const WA_NUMBER = "5493704777656";            // WhatsApp: 54 + 9 + característica + número
const ARS = n => "$" + new Intl.NumberFormat("es-AR").format(n);

/* Horarios: minutos desde las 00:00 (20:00 = 1200, 00:00 = 1440). 0 = domingo … 6 = sábado */
const DAYS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const SCHED = {0:[[720,900],[1200,1440]],1:[],2:[[1200,1440]],3:[[1200,1440]],4:[[1200,1440]],5:[[1200,1440]],6:[[1200,1440]]};

/* Menú: precios en pesos, sin puntos. "extras" = agregados con su precio. */
const MENU = [
  { id:"rosse", title:"Pizze", accent:"rosse", note:"Con salsa de tomate", kind:"food", groups:[{ items:[
    { id:"marinara", name:"Marinara", price:20000, desc:"Tomate, ajo, orégano, albahaca y oliva.", extras:[["Anchoas",2400],["Stracciatella",4400]] },
    { id:"margherita", name:"Margherita", price:22000, desc:"Tomate, fior di latte, parmesano, albahaca y oliva." },
    { id:"margherita-2", name:"Margherita 2.0", price:24000, desc:"Tomate, fior di latte, tomates cherry, parmesano, albahaca y oliva." },
    { id:"diavola", name:"Diavola", price:24000, desc:"Tomate, fior di latte, salami, cebolla, miel, albahaca y oliva." },
    { id:"napoli", name:"Nápoli", price:26000, desc:"Tomate, fior di latte, anchoas, alcaparras, olivas negras, orégano, albahaca y oliva." },
    { id:"capricciosa", name:"Capricciosa", price:27000, desc:"Tomate, fior di latte, jamón, champiñones, olivas negras, albahaca y oliva." },
    { id:"crudo-rucula", name:"Crudo e Rúcula", price:28000, desc:"Tomate, jamón crudo, rúcula, escamas de parmesano y oliva.", extras:[["Stracciatella",4400]] },
  ]}]},
  { id:"bianche", title:"Pizze", accent:"bianche", note:"Sin tomate, base de fior di latte", kind:"food", groups:[{ items:[
    { id:"cebolla", name:"Cebolla", price:22000, desc:"Fior di latte, cebolla, orégano y oliva.", extras:[["Panceta",1800]] },
    { id:"caprese-pizza", name:"Caprese", price:23000, desc:"Tomates cherry, fior di latte, parmesano, pesto, albahaca y oliva." },
    { id:"quattro-formaggi", name:"Quattro Formaggi", price:23000, desc:"Fior di latte, parmesano, azul y queso crema.", extras:[["Hongos",2200]] },
    { id:"di-patate", name:"Di Patate", price:24000, desc:"Fior di latte, papas, romero, escamas de panceta y oliva." },
    { id:"mortadela-pizza", name:"Mortadela", price:24000, desc:"Fior di latte, mortadela de pistachos, pesto y oliva.", extras:[["Stracciatella",4400]] },
    { id:"di-pera", name:"Di Pera", price:25000, desc:"Fior di latte, queso azul, peras, nueces, pesto, miel y oliva." },
    { id:"tartufo-funghi", name:"Tartufo e Funghi", price:26000, desc:"Fior di latte, champiñones, salsa de trufa y hongos, y oliva." },
  ]}]},
  { id:"calzone", title:"Calzone", note:"Pizza cerrada, rellena", kind:"food", groups:[{ items:[
    { id:"calzone-jamon", name:"Jamón", price:27000, desc:"Tomate, fior di latte, ricota, jamón, albahaca y oliva." },
    { id:"calzone-salami", name:"Salami", price:27000, desc:"Tomate, fior di latte, ricota, salami, albahaca y oliva." },
  ]}]},
  { id:"antipasti", title:"Antipasti", note:"Para empezar o compartir", kind:"food", groups:[
    { items:[
      { id:"burratina", name:"Burratina", price:16000 },
      { id:"burrata", name:"Burrata", price:22000 },
      { id:"degustacion", name:"Degustación de quesos y fiambres", price:28000 },
    ]},
    { label:"Pane", items:[
      { id:"pane-romero", name:"Pane con romero", price:12000 },
      { id:"pane-ajo-queso", name:"Pane con ajo y queso", price:14000 },
      { id:"pane-crudo", name:"Pane con jamón crudo", price:16000 },
    ]},
    { label:"Stracciatella", items:[
      { id:"stracciatella-cherry", name:"Stracciatella con tomates cherry y rúcula", price:22000 },
      { id:"stracciatella-mortadela", name:"Stracciatella con mortadela de pistachos", price:24000 },
      { id:"stracciatella-crudo", name:"Stracciatella con jamón crudo", price:26000 },
    ]},
  ]},
  { id:"panino", title:"Panino", note:"Sándwich en pan de pizza", kind:"food", groups:[{ items:[
    { id:"panino-caprese", name:"Caprese", price:20000, desc:"Tomate, fior di latte, pesto y oliva." },
    { id:"panino-mortadela", name:"Mortadela", price:22000, desc:"Mortadela, stracciatella, pistachos y pesto." },
    { id:"panino-crudo", name:"Jamón crudo", price:24000, desc:"Jamón crudo, fior di latte, rúcula y parmesano." },
  ]}]},
  { id:"insalate", title:"Insalate", note:"Ensaladas", kind:"food", groups:[{ items:[
    { id:"insalata-caprese", name:"Caprese", price:16000, desc:"Tomate, fior di latte, albahaca, pesto y oliva." },
    { id:"cesar", name:"César con pollo", price:17000 },
    { id:"little-italy", name:"Little Italy", price:17000, desc:"Mix de lechugas, olivas negras, nueces, queso azul, cherrys, escamas de parmesano, oliva y aceto." },
    { id:"mix-verdes", name:"Mix de verdes", price:19000, desc:"Jamón crudo, stracciatella, peras, parmesano, vinagreta de mostaza y miel." },
  ]}]},
  { id:"pasta", title:"Pasta", note:"", kind:"food", groups:[{ items:[
    { id:"noqui-4-formaggi", name:"Ñoqui al Quattro Formaggi", price:24000 },
    { id:"noqui-bolognese", name:"Ñoqui al Ragù Bolognese", price:26000 },
    { id:"casarecce-pesto", name:"Casarecce al Pesto Genovese", price:24000 },
    { id:"tagliatelle-bolognese", name:"Tagliatelle al Ragù Bolognese", price:26000 },
    { id:"ravioles", name:"Ravioles de ricotta y espinaca", price:26000, desc:"Pomodoro e basilico." },
    { id:"rigatoni-amatriciana", name:"Rigatoni all'Amatriciana", price:29000, desc:"Pomodoro, guanciale, parmesano." },
  ]}]},
  { id:"dolci", title:"Il dolce", note:"Postres", kind:"food", groups:[{ items:[
    { id:"helado", name:"Bocha de helado", price:6000, desc:"Consultá los sabores del día." },
    { id:"flan", name:"Flan", price:10000, extras:[["Dulce de leche",1400]] },
    { id:"tiramisu", name:"Tiramisù", price:12000 },
    { id:"pizza-nutella", name:"Pizza dolce Nutella", price:16000, tag:"Ideal para compartir" },
    { id:"mamon-queso", name:"Mamón con queso", price:17000 },
  ]}]},
  { id:"bebidas", title:"Bebidas", note:"", kind:"drinks", groups:[
    { label:"Sin alcohol", items:[
      { id:"limonada", name:"Limonada", price:3800 },
      { id:"agua", name:"Agua con o sin gas", price:4200 },
      { id:"jugo", name:"Jugo de naranja", price:4600 },
      { id:"gaseosa", name:"Gaseosa personal", price:4400 },
      { id:"gaseosa-l", name:"Gaseosa litro", price:8600 },
    ]},
    { label:"Aperitivo", items:[
      { id:"shot-limoncello", name:"Shot de lemoncello", price:2800 },
      { id:"vermouth", name:"Vermouth", price:10000 },
      { id:"caipirina", name:"Caipiriña", price:11000 },
      { id:"mojito", name:"Mojito", price:11000 },
      { id:"apegin", name:"ApeGin", price:12000, desc:"Aperol, gin y limón" },
      { id:"fernet", name:"Fernet", price:13000 },
      { id:"garibaldi", name:"Garibaldi", price:13000, desc:"Campari y naranja" },
      { id:"gintonic", name:"Gin tonic", price:14000 },
      { id:"francello", name:"Francello", price:15000, desc:"Lemoncello, tónica, jengibre y menta" },
      { id:"aperol", name:"Aperol", price:15000 },
    ]},
    { label:"Birre", items:[
      { id:"salta-negra", name:"Salta Negra lata", price:6200 },
      { id:"heineken-00", name:"Heineken 0.0", price:6200 },
      { id:"chopp", name:"Chopp Heineken", price:8500 },
      { id:"peroni", name:"Peroni 330 cc", price:9600 },
      { id:"heineken-l", name:"Heineken litro", price:16000 },
    ]},
  ]},
];

/* Créditos de las fotos (Wikimedia Commons) */
const CREDITS = {"margherita": ["Valerio Capello at English Wikipedia", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Eq_it-na_pizza-margherita_sep2005_sml.jpg"], "marinara": ["Ruthven", "CC0", "https://commons.wikimedia.org/wiki/File:Pizza_marinara_(Napoli).jpg"], "margherita-2": ["CDibisceglia", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Pizza_Napoletana_Contemporanea.jpg"], "diavola": ["JIP", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Pizza_Diavola_at_Alby%27s_Pizza.jpg"], "napoli": ["Nicholas Gemini", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Pizza_Napoli_2024.jpg"], "capricciosa": ["Phil Whitehouse from London, United Kingdom", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Pizza_capricciosa.jpg"], "crudo-rucula": ["Autor desconocido", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Rossa_pizza_23_January_2025_Trattoria_%26_Dolci_Solaire_Resort_NorthC.jpg"], "cebolla": ["stu_spivack", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Sugar_onion_pizza_(2737922772).jpg"], "caprese-pizza": ["jeffreyw", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Homemade_pizza_with_cherry_tomatoes_and_basil.jpg"], "quattro-formaggi": ["Aiyanakk", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:%D0%98%D1%82%D0%B0%D0%BB%D0%B8%D1%8F_4_%D1%81%D1%8B%D1%80_%D0%BF%D0%B8%D1%86%D1%86%D0%B0%D1%81%D1%8B.jpg"], "di-patate": ["cyclonebill", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Flickr_-_cyclonebill_-_Kartoffelpizza_med_rosmarinpesto.jpg"], "mortadela-pizza": ["Christo", "CC0", "https://commons.wikimedia.org/wiki/File:Budapest,_MANU%2B_pizz%C3%A9ria,_Mortadella_pizza.jpg"], "di-pera": ["Bluyten", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Walnut_pear_pizza.jpg"], "tartufo-funghi": ["Thamizhpparithi Maari", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Mushroom_Pizza_of_Esino_Lario.jpg"], "calzone-jamon": ["Mario56", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Calzone_Tradition.JPG"], "calzone-salami": ["Deryck Chan", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Wikimania_2016_Deryck_day_0_-_07_calzone.jpg"], "burratina": ["Andy Li", "CC0", "https://commons.wikimedia.org/wiki/File:Burrata_-_Nanninella.jpg"], "burrata": ["Popo le Chien", "CC0", "https://commons.wikimedia.org/wiki/File:Burrata2.jpg"], "degustacion": ["terri_bateman", "CC0", "https://commons.wikimedia.org/wiki/File:-365photo_2017_edition_Food_(32033206853).jpg"], "pane-romero": ["Jennifer from SW Washington State, USA", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Focaccia_con_rosmarino_del_giardino.jpg"], "pane-ajo-queso": ["Andy Li", "CC0", "https://commons.wikimedia.org/wiki/File:Garlic_Bread_Mozzarella_-_Oregano_Pizzeria_2025-05-17.jpg"], "pane-crudo": ["Bart Everson", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Prosciutto,_Gorgonzola_and_Fig_Flat_Bread_with_Balsamic_Reduction.jpg"], "stracciatella-cherry": ["Luistxo", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Pomodoro_con_stracciatella_(cropped).jpg"], "stracciatella-mortadela": ["Romainbehar", "CC0", "https://commons.wikimedia.org/wiki/File:Lyon_2e_-_Quai_Antoine_Riboud_-_Restaurant_Terra_Mia_-_Pizza_La_Bronte.jpg"], "stracciatella-crudo": ["lazy fri13th", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Burrata_cheese.jpg"], "panino-caprese": ["HarshLight from San Jose, CA, USA", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Caprese_Sandwich,_Jolly_Holiday_Bakery_Cafe_2013.jpg"], "panino-mortadela": ["Nikodem Nijaki", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Mortadella_IMGP0978.jpg"], "panino-crudo": ["Pava", "CC BY-SA 3.0 it", "https://commons.wikimedia.org/wiki/File:%22_15_-_ITALY_-_sandwich_with_Prosciutto_Crudo_PARMA_32_mesi_(32_months)_and_FIORE_Sardo_DOP_cheese.jpg"], "insalata-caprese": ["spiralmushroom", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Caprese_salad_in_homemade.jpg"], "cesar": ["Daderot", "CC0", "https://commons.wikimedia.org/wiki/File:Chicken_Caesar_salad_-_Auckland,_New_Zealand.jpg"], "little-italy": ["Missvain", "CC0", "https://commons.wikimedia.org/wiki/File:BV_Whiskey_Bar_and_Grill_-_April_2025_-_Sarah_Stierch_02.jpg"], "mix-verdes": ["Mihail Verbal", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:%D0%A1%D0%B5%D0%B7%D0%BE%D0%BD%D1%81%D0%BA%D0%B0_%D0%BB%D0%B5%D1%82%D0%BD%D0%B0_%D1%81%D0%B0%D0%BB%D0%B0%D1%82%D0%B0_%D0%BE%D0%B4_%D0%BF%D0%B0%D1%80%D1%87%D0%B8%D1%9A%D0%B0_%D0%B8%D1%81%D0%B5%D1%86%D0%BA%D0%B0%D0%BD%D0%B8_%D0%BF%D1%80%D0%B0%D1%81%D0%BA%D0%B8_%D0%B8_%D0%BF%D1%80%D1%88%D1%83%D1%82%D0%B0.jpg"], "noqui-4-formaggi": ["FakirNL", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Gnocchi_ai_quattro_formaggi.jpg"], "noqui-bolognese": ["Alpha", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Beef_Ragu_with_Gnocchi_-_Lower_House,_Federation_Square.jpg"], "casarecce-pesto": ["M&A", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Pasta_al_pesto_con_fagiolini_e_patate.jpg"], "tagliatelle-bolognese": ["Ivan Vighetto", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Tagliatelle_al_rag%C3%B9_(image_modified).jpg"], "ravioles": ["Benreis", "CC BY 3.0", "https://commons.wikimedia.org/wiki/File:Ricotta_Ravioli_Tokk_Victoria_Gozo.jpg"], "rigatoni-amatriciana": ["Randy OHC from West Park, New York, USA", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Maccheroni_alla_amatriciana_(3543752494).jpg"], "helado": ["Ruth Hartnup from Vancouver, Canada", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Mango_gelato_(9368461646).jpg"], "flan": ["PallaviKhale", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Caramel_custard_PK020.jpg"], "tiramisu": ["Sharon Chen from Austin, United States", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Classic_Italian_Tiramisu-3_(29989504485).jpg"], "pizza-nutella": ["Mack Male from Edmonton, AB, Canada", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Nutella_Pizza_from_Famoso_(3066987997).jpg"], "mamon-queso": ["Horacio Cambeiro", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Mam%C3%B3n_en_alm%C3%ADbar_con_queso_sobre_plato_blanco.png"]};
