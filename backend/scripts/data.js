const data = [
  {
    name: "South India",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80",
    states: [
      {
        name: "Kerala",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80",
        destinations: [
          {
            name: "Munnar",
            description: "Hill station famous for tea plantations and misty valleys",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",
            bestTimeToVisit: "September – March"
          },
          {
            name: "Alleppey",
            description: "Known for serene backwaters and luxurious houseboats",
            image: "https://images.unsplash.com/photo-1609147855836-d25aded9e8e9?w=600&q=80",
            bestTimeToVisit: "November – February"
          },
          {
            name: "Wayanad",
            description: "Lush forests, waterfalls and tribal heritage",
            image: "https://images.unsplash.com/photo-1580889240948-c80e5f455ae7?w=600&q=80",
            bestTimeToVisit: "October – May"
          },
          {
            name: "Thekkady",
            description: "Home to Periyar Wildlife Sanctuary and spice plantations",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
            bestTimeToVisit: "October – March"
          }
        ]
      },
      {
        name: "Tamil Nadu",
        image: "https://images.unsplash.com/photo-1621996659490-3275b4d0d951?w=600&q=80",
        destinations: [
          {
            name: "Ooty",
            description: "Queen of hill stations nestled in the Nilgiris",
            image: "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=600&q=80",
            bestTimeToVisit: "April – June, September – November"
          },
          {
            name: "Madurai",
            description: "Ancient temple city with the iconic Meenakshi Amman Temple",
            image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Rameswaram",
            description: "Sacred pilgrimage island at the tip of India",
            image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&q=80",
            bestTimeToVisit: "October – April"
          }
        ]
      },
      {
        name: "Karnataka",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80",
        destinations: [
          {
            name: "Hampi",
            description: "UNESCO World Heritage ruins of the Vijayanagara Empire",
            image: "https://images.unsplash.com/photo-1615645151316-e2e19d1ef92f?w=600&q=80",
            bestTimeToVisit: "October – February"
          },
          {
            name: "Coorg",
            description: "Scotland of India with coffee estates and misty hills",
            image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Mysore",
            description: "City of palaces and the grand Dasara festival",
            image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
            bestTimeToVisit: "October – February"
          }
        ]
      },
      {
        name: "Andhra Pradesh",
        image: "https://images.unsplash.com/photo-1599930113854-d6d7fd522214?w=600&q=80",
        destinations: [
          {
            name: "Tirupati",
            description: "One of the most visited religious sites in the world",
            image: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=600&q=80",
            bestTimeToVisit: "September – February"
          },
          {
            name: "Araku Valley",
            description: "Picturesque valley with coffee plantations and tribal culture",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
            bestTimeToVisit: "October – March"
          }
        ]
      }
    ]
  },
  {
    name: "North India",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80",
    states: [
      {
        name: "Himachal Pradesh",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
        destinations: [
          {
            name: "Manali",
            description: "Popular Himalayan gateway for adventure and snow",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
            bestTimeToVisit: "October – June (snow lovers: December – February)"
          },
          {
            name: "Shimla",
            description: "Former British summer capital with colonial charm",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80",
            bestTimeToVisit: "March – June, September – November"
          },
          {
            name: "Spiti Valley",
            description: "Cold desert mountain valley with ancient monasteries",
            image: "https://images.unsplash.com/photo-1571993084503-8ed3ea1bdf9b?w=600&q=80",
            bestTimeToVisit: "June – October"
          },
          {
            name: "Dharamshala",
            description: "Himalayan town home to the Dalai Lama and Tibetan culture",
            image: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=600&q=80",
            bestTimeToVisit: "March – June, September – December"
          }
        ]
      },
      {
        name: "Rajasthan",
        image: "https://images.unsplash.com/photo-1477587458883-47145ed6a6a6?w=600&q=80",
        destinations: [
          {
            name: "Jaipur",
            description: "The Pink City with magnificent forts and palaces",
            image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Jaisalmer",
            description: "Golden Fort rising from the Thar Desert sands",
            image: "https://images.unsplash.com/photo-1598977763459-1e899fcfdf8b?w=600&q=80",
            bestTimeToVisit: "November – March"
          },
          {
            name: "Udaipur",
            description: "City of Lakes with romantic floating palaces",
            image: "https://images.unsplash.com/photo-1585828922344-85c9daa264b0?w=600&q=80",
            bestTimeToVisit: "September – March"
          },
          {
            name: "Pushkar",
            description: "Sacred lake town famous for the annual camel fair",
            image: "https://images.unsplash.com/photo-1603695374938-9f6bc7d28f0d?w=600&q=80",
            bestTimeToVisit: "October – March"
          }
        ]
      },
      {
        name: "Uttar Pradesh",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
        destinations: [
          {
            name: "Agra",
            description: "Home to the timeless Taj Mahal, a wonder of the world",
            image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Varanasi",
            description: "One of the world's oldest living cities on the Ganges",
            image: "https://images.unsplash.com/photo-1561361058-c24e01f5f252?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Lucknow",
            description: "City of Nawabs with Mughal architecture and kebabs",
            image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
            bestTimeToVisit: "October – March"
          }
        ]
      },
      {
        name: "Jammu & Kashmir",
        image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80",
        destinations: [
          {
            name: "Srinagar",
            description: "Jewel of Kashmir with Dal Lake and floating gardens",
            image: "https://images.unsplash.com/photo-1580204560672-c2e22d0a8a4b?w=600&q=80",
            bestTimeToVisit: "April – October"
          },
          {
            name: "Gulmarg",
            description: "Skiing paradise and summer meadow of flowers",
            image: "https://images.unsplash.com/photo-1598977763459-1e899fcfdf8b?w=600&q=80",
            bestTimeToVisit: "December – March (skiing), May – September (trekking)"
          },
          {
            name: "Pahalgam",
            description: "Valley of Shepherds with rivers and alpine meadows",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
            bestTimeToVisit: "April – October"
          }
        ]
      }
    ]
  },
  {
    name: "East India",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    states: [
      {
        name: "West Bengal",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
        destinations: [
          {
            name: "Darjeeling",
            description: "Land of tea gardens with views of Kangchenjunga",
            image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
            bestTimeToVisit: "March – May, September – November"
          },
          {
            name: "Sundarbans",
            description: "World's largest mangrove delta, home to Royal Bengal Tigers",
            image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Kolkata",
            description: "City of Joy with colonial heritage and vibrant culture",
            image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
            bestTimeToVisit: "October – February"
          }
        ]
      },
      {
        name: "Odisha",
        image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=600&q=80",
        destinations: [
          {
            name: "Puri",
            description: "Sacred beach town with the famous Jagannath Temple",
            image: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Konark",
            description: "Sun Temple, a UNESCO World Heritage architectural marvel",
            image: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Chilika Lake",
            description: "Asia's largest brackish water lagoon with flamingos",
            image: "https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=600&q=80",
            bestTimeToVisit: "November – March"
          }
        ]
      },
      {
        name: "Sikkim",
        image: "https://images.unsplash.com/photo-1571993084503-8ed3ea1bdf9b?w=600&q=80",
        destinations: [
          {
            name: "Gangtok",
            description: "Hilltop capital with panoramic Himalayan views",
            image: "https://images.unsplash.com/photo-1568454537842-d933259bb258?w=600&q=80",
            bestTimeToVisit: "March – May, October – December"
          },
          {
            name: "Tsomgo Lake",
            description: "Glacial lake at 12,313 ft surrounded by snowy peaks",
            image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80",
            bestTimeToVisit: "April – August"
          }
        ]
      },
      {
        name: "Assam",
        image: "https://images.unsplash.com/photo-1580889240948-c80e5f455ae7?w=600&q=80",
        destinations: [
          {
            name: "Kaziranga National Park",
            description: "UNESCO park home to two-thirds of the world's one-horned rhinos",
            image: "https://images.unsplash.com/photo-1557786533-c5a65440c70c?w=600&q=80",
            bestTimeToVisit: "November – April"
          },
          {
            name: "Majuli",
            description: "World's largest river island with Vaishnavite monasteries",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
            bestTimeToVisit: "October – March"
          }
        ]
      }
    ]
  },
  {
    name: "West India",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed6a6a6?w=600&q=80",
    states: [
      {
        name: "Goa",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
        destinations: [
          {
            name: "Baga Beach",
            description: "Vibrant beach hub with nightlife, water sports and shacks",
            image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80",
            bestTimeToVisit: "November – February"
          },
          {
            name: "Old Goa",
            description: "UNESCO-listed Portuguese churches and baroque architecture",
            image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=600&q=80",
            bestTimeToVisit: "November – March"
          },
          {
            name: "Dudhsagar Falls",
            description: "Majestic four-tiered waterfall inside dense jungle",
            image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80",
            bestTimeToVisit: "June – December (monsoon peak)"
          }
        ]
      },
      {
        name: "Maharashtra",
        image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80",
        destinations: [
          {
            name: "Mumbai",
            description: "Maximum city — Bollywood, Gateway of India and marine drive",
            image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=80",
            bestTimeToVisit: "November – February"
          },
          {
            name: "Lonavala",
            description: "Breezy hill station with forts and cascading waterfalls",
            image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=600&q=80",
            bestTimeToVisit: "June – September (monsoon magic)"
          },
          {
            name: "Ajanta & Ellora Caves",
            description: "Ancient rock-cut caves with breathtaking Buddhist murals",
            image: "https://images.unsplash.com/photo-1592439403668-cc7e74c72b0e?w=600&q=80",
            bestTimeToVisit: "November – March"
          }
        ]
      },
      {
        name: "Gujarat",
        image: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=600&q=80",
        destinations: [
          {
            name: "Rann of Kutch",
            description: "Vast white salt desert dazzling under the full moon",
            image: "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=600&q=80",
            bestTimeToVisit: "November – February (Rann Utsav festival)"
          },
          {
            name: "Gir National Park",
            description: "Last refuge of the majestic Asiatic Lion",
            image: "https://images.unsplash.com/photo-1557786533-c5a65440c70c?w=600&q=80",
            bestTimeToVisit: "December – March"
          },
          {
            name: "Dwarka",
            description: "One of Hinduism's holiest cities on the Arabian Sea",
            image: "https://images.unsplash.com/photo-1599930113854-d6d7fd522214?w=600&q=80",
            bestTimeToVisit: "October – March"
          }
        ]
      }
    ]
  },
  {
    name: "Central India",
    image: "https://images.unsplash.com/photo-1615645151316-e2e19d1ef92f?w=600&q=80",
    states: [
      {
        name: "Madhya Pradesh",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80",
        destinations: [
          {
            name: "Khajuraho",
            description: "UNESCO temples with exquisite medieval erotic sculptures",
            image: "https://images.unsplash.com/photo-1592439403668-cc7e74c72b0e?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Bandhavgarh National Park",
            description: "Highest density of Bengal Tigers in any Indian reserve",
            image: "https://images.unsplash.com/photo-1557786533-c5a65440c70c?w=600&q=80",
            bestTimeToVisit: "October – June"
          },
          {
            name: "Orchha",
            description: "Forgotten medieval town with palaces rising over the Betwa river",
            image: "https://images.unsplash.com/photo-1615645151316-e2e19d1ef92f?w=600&q=80",
            bestTimeToVisit: "October – March"
          },
          {
            name: "Pachmarhi",
            description: "Only hill station in MP with forests, waterfalls and caves",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
            bestTimeToVisit: "October – June"
          }
        ]
      },
      {
        name: "Chhattisgarh",
        image: "https://images.unsplash.com/photo-1580889240948-c80e5f455ae7?w=600&q=80",
        destinations: [
          {
            name: "Chitrakoot Falls",
            description: "India's widest waterfall, the Niagara of India",
            image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80",
            bestTimeToVisit: "July – October"
          },
          {
            name: "Bastar",
            description: "Dense tribal heartland with Dantewada temples and craft markets",
            image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=600&q=80",
            bestTimeToVisit: "October – March"
          }
        ]
      },
      {
        name: "Telangana",
        image: "https://images.unsplash.com/photo-1599930113854-d6d7fd522214?w=600&q=80",
        destinations: [
          {
            name: "Hyderabad",
            description: "City of pearls with Charminar, biriyani and IT culture",
            image: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=600&q=80",
            bestTimeToVisit: "October – February"
          },
          {
            name: "Warangal",
            description: "Ancient Kakatiya capital with stunning thousand-pillar temple",
            image: "https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=600&q=80",
            bestTimeToVisit: "October – March"
          }
        ]
      }
    ]
  }
];

export default data;
