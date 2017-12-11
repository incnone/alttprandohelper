(function(window) {
    'use strict';

    var query = uri_query(),
        is_standard = query.mode === 'standard';

    function can_reach_outcast() {
        return items.moonpearl && (
            items.glove === 2 || items.glove && items.hammer ||
            items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers));
    }
	
	function can_reach_outcast_with_aga() {
        return items.moonpearl && items.hookshot && (items.hammer || items.glove || items.flippers);
	}

    function medallion_check(i) {
        if (!items.sword || !items.bombos && !items.ether && !items.quake) return 'unavailable';
        if (medallions[i] === 1 && !items.bombos ||
            medallions[i] === 2 && !items.ether ||
            medallions[i] === 3 && !items.quake) return 'unavailable';
        if (medallions[i] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';
    }

    function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 1; }
    function cane() { return items.somaria || items.byrna; }
    function rod() { return items.firerod || items.icerod; }

	function agahnim() { return items.agahnim ? 'available' :
		items.sword >= 2 || (items.cape && items.sword) ? 'agapossible' : 'unavailable';
	}
    function always() { return 'available'; }

    // define dungeon chests
    window.dungeons = [{ // [0]
        caption: 'Eastern Palace {lantern}',
        is_beaten: false,
        is_beatable: function() {
            return items.bow > 1 ?
                items.lantern ? 'available' : 'dark' :
                'unavailable';
        },
        can_get_chest: function() {
            return items.chest0 <= 2 && !items.lantern ||
                items.chest0 === 1 && !(items.bow > 1) ?
                'possible' : 'available';
        }
    }, { // [1]
        caption: 'Desert Palace',
        is_beaten: false,
        is_beatable: function() {
            if (!(melee_bow() || cane() || rod())) return 'unavailable';
            if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
            if (!items.lantern && !items.firerod) return 'unavailable';
            return items.boots ? 'available' : 'possible';
        },
        can_get_chest: function() {
            if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
            if (items.glove && (items.firerod || items.lantern) && items.boots) return 'available';
            return items.chest1 > 1 && items.boots ? 'available' : 'possible';
        }
    }, { // [2]
        caption: 'Tower of Hera',
        is_beaten: false,
        is_beatable: function() {
            if (!melee()) return 'unavailable';
            return this.can_get_chest();
        },
        can_get_chest: function() {
            if (!items.flute && !items.glove) return 'unavailable';
            if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
            return items.firerod || items.lantern ?
                items.flute || items.lantern ? 'available' : 'dark' :
                'possible';
        }
    }, { // [3]
        caption: 'Palace of Darkness {lantern}',
        is_beaten: false,
        is_beatable: function() {
            if (!items.moonpearl || !(items.bow > 1) || !items.hammer) return 'unavailable';
			if (items.glove) return items.lantern ? 'available' : 'dark';
			if (!items.agahnim) return agahnim();
            return items.lantern ? 'available' : 'dark';
        },
        can_get_chest: function() {
            if (!items.moonpearl) return 'unavailable';
            if (!(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return agahnim();
            return !(items.bow > 1 && items.lantern) ||
                items.chest3 === 1 && !items.hammer ?
                'possible' : 'available';
        }
    }, { // [4]
        caption: 'Swamp Palace {mirror}',
        is_beaten: false,
        is_beatable: function() {
            if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
            if (!items.hammer || !items.hookshot) return 'unavailable';
            if (!items.glove) return agahnim();
            return 'available';
        },
        can_get_chest: function() {
            if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
			if (!can_reach_outcast()) return items.hammer ? agahnim() : can_reach_outcast_with_aga() ? 'agahnim' : 'unavailable';

            if (items.chest4 <= 2) return !items.hammer || !items.hookshot ? 'unavailable' : 'available';
            if (items.chest4 <= 4) return !items.hammer ? 'unavailable' : !items.hookshot ? 'possible' : 'available';
            if (items.chest4 <= 5) return !items.hammer ? 'unavailable' : 'available';
            return !items.hammer ? 'possible' : 'available';
            }
    }, { // [5]
        caption: 'Skull Woods',
        is_beaten: false,
        is_beatable: function() {
			if (!items.firerod || !items.sword) 
				return 'unavailable';
			else if (can_reach_outcast()) 
				return 'available';
			else if (can_reach_outcast_with_aga()) 
				return agahnim();
			else
				return 'unavailable';
        },
        can_get_chest: function() {
            if (can_reach_outcast())
				return items.firerod ? 'available' : 'possible';
			else if (can_reach_outcast_with_aga())
				return agahnim();
			else
				return 'unavailable';
        }
    }, { // [6]
        caption: 'Thieves\' Town',
        is_beaten: false,
        is_beatable: function() 
		{
            if (melee() || cane())
			{
				if (can_reach_outcast()) 
					return 'available';
				else if (can_reach_outcast_with_aga()) 
					return agahnim();
			}
			else
			{
				return 'unavailable';
			}
        },
        can_get_chest: function() 
		{
			if (can_reach_outcast())
				return items.chest6 === 1 && !items.hammer ? 'possible' : 'available';
			else if (can_reach_outcast_with_aga())
				return agahnim();
			else 
				return 'unavailable';
        }
    }, { // [7]
        caption: 'Ice Palace',
        is_beaten: false,
        is_beatable: function() 
		{
            if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer) 
				return 'unavailable';
            else if (!items.firerod && !(items.bombos && items.sword)) 
				return 'unavailable';
            else 
				return items.hookshot || items.somaria ? 'available' : 'glitchable';
        },
        can_get_chest: function() 
		{
            if (!items.moonpearl || !items.flippers || items.glove !== 2) 
				return 'unavailable';
            else if (!items.firerod && !(items.bombos && items.sword)) 
				return 'unavailable';
            else 
				return items.hammer ? 'available' : 'glitchable';
        }
    }, { // [8]
        caption: 'Misery Mire {medallion0}{lantern}',
        is_beaten: false,
        is_beatable: function() 
		{
            if (!melee_bow()) 
				return 'unavailable';
            else if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) 
				return 'unavailable';
            else if (!items.boots && !items.hookshot) 
				return 'unavailable';
            else
			{
				var state = medallion_check(0);
				if (state) 
					return state;

				return items.lantern || items.firerod ?
					items.lantern ? 'available' : 'dark' :
					'possible';
			}
        },
        can_get_chest: function() 
		{
            if (!items.moonpearl || !items.flute || items.glove !== 2) 
				return 'unavailable';
            else if (!items.boots && !items.hookshot) 
				return 'unavailable';
            else
			{
				var state = medallion_check(0);
				if (state) 
					return state;

				return (items.chest8 > 1 ?
					items.lantern || items.firerod :
					items.lantern && items.somaria) ?
					'available' : 'possible';
			}
        }
    }, { // [9]
        caption: 'Turtle Rock {medallion0}{lantern}',
        is_beaten: false,
        is_beatable: function() 
		{
            if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) 
				return 'unavailable';
            else if (!items.hookshot && !items.mirror) 
				return 'unavailable';
            else if (!items.icerod || !items.firerod) 
				return 'unavailable';
			
            var state = medallion_check(1);
            if (state) 
				return state;

            return items.byrna || items.cape || items.shield === 3 ?
                items.lantern ? 'available' : 'dark' :
                'possible';
        },
        can_get_chest: function() 
		{
            if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) 
				return 'unavailable';
            else if (!items.hookshot && !items.mirror) 
				return 'unavailable';
			
            var state = medallion_check(1);
            if (state) 
				return state;

            var laser_safety = items.byrna || items.cape || items.shield === 3,
                dark_room = items.lantern ? 'available' : 'dark';
            
			if (items.chest9 <= 1) 
				return !laser_safety ? 'glitchable' : items.firerod && items.icerod ? dark_room : 'possible';
            if (items.chest9 <= 2) 
				return !laser_safety ? 'glitchable' : items.firerod ? dark_room : 'possible';
            if (items.chest9 <= 4) 
				return laser_safety && items.firerod && items.lantern ? 'available' : 'glitchable';
            
			return items.firerod && items.lantern ? 'available' : 'possible';
        }
    }];

    window.agahnim = {
        caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
        is_available: function() {
            return items.sword >= 2 || items.cape && items.sword ?
                items.lantern ? 'available' : 'dark' :
                'unavailable';
        }
    };

    //define overworld chests
    window.chests = [{ // [0]
        caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
        is_opened: false,
        is_available: function() {
            if (!items.boots) return 'unavailable';
            if (can_reach_outcast() && items.mirror || items.glove === 2) return 'available';
            return 'unavailable';
        }
    }, { // [1]
        caption: 'Light World Swamp (2)',
        is_opened: false,
        is_available: always
    }, { // [2]
        caption: 'Link\'s House',
        is_opened: is_standard,
        is_available: always
    }, { // [3]
        caption: 'Spiral Cave',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [4]
        caption: 'Mimic Cave {mirror}',
        is_opened: false,
        is_available: function() {
            if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
            var state = medallion_check(1);
            if (state) return state;

            return items.firerod ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'possible';
        }
    }, { // [5]
        caption: 'Tavern',
        is_opened: false,
        is_available: always
    }, { // [6]
        caption: 'Chicken House {bomb}',
        is_opened: false,
        is_available: always
    }, { // [7]
        caption: 'Bombable Hut {bomb}',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : can_reach_outcast_with_aga() ? agahnim() : 'unavailable';
        }
    }, { // [8]
        caption: 'C House',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : can_reach_outcast_with_aga() ? agahnim() : 'unavailable';
        }
    }, { // [9]
        caption: 'Aginah\'s Cave {bomb}',
        is_opened: false,
        is_available: always
    }, { // [10]
        caption: 'West of Mire (2)',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
        }
    }, { // [11]
        caption: 'Super Bunny Cave (2)',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [12]
        caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
        is_opened: false,
        is_available: always
    }, { // [13]
        caption: 'Byrna Spike Cave',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove && items.hammer && (items.byrna || items.cape) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [14]
        caption: 'Kakariko Well (4 + {bomb})',
        is_opened: false,
        is_available: always
    }, { // [15]
        caption: 'Thieves\' Hut (4 + {bomb})',
        is_opened: false,
        is_available: always
    }, { // [16]
        caption: 'Hype Cave {bomb} (NPC + 4 {bomb})',
        is_opened: false,
        is_available: function() 
		{
			if (can_reach_outcast())
				return 'available';
			else if (items.hammer || can_reach_outcast_with_aga())
				return agahnim();
			else
				return 'unavailable';
        }
    }, { // [17]
        caption: 'Death Mountain East (5 + 2 {bomb})',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [18]
        caption: 'West of Sanctuary {boots}',
        is_opened: false,
        is_available: function() {
            return items.boots ? 'available' : 'unavailable';
        }
    }, { // [19]
        caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
        is_opened: false,
        is_available: always
    }, { // [20]
        caption: 'Ice Rod Cave {bomb}',
        is_opened: false,
        is_available: always
    }, { // [21]
        caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [22]
        caption: 'Hookshot Cave  (3 top chests) {hookshot}',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && items.hookshot ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [23]
        caption: 'Treasure Chest Minigame: {rupee} 30 ',
        is_opened: false,
        is_available: function() {
            return can_reach_outcast() ? 'available' : can_reach_outcast_with_aga() ? agahnim() : 'unavailable';
        }
    }, { // [24]
        caption: 'Bottle Vendor: {rupee} 100',
        is_opened: false,
        is_available: always
    }, { // [25]
        caption: 'Sahasrahla {pendant0}',
        is_opened: false,
        is_available: function() {
            for (var k = 0; k < 10; k++) {
                if (prizes[k] === 1 && items['boss'+k])
                    return 'available';
            }
            return 'unavailable';
        }
    }, { // [26]
        caption: 'Haunted Grove',
        is_opened: false,
        is_available: function() {
			if (can_reach_outcast())
				return 'available';
			else if ( (items.moonpearl && items.hammer) || can_reach_outcast_with_aga() )
				return agahnim();
			else 
				return 'unavailable';
        }
    }, { // [27]
        caption: 'Sick kid {bottle}',
        is_opened: false,
        is_available: function() {
            return items.bottle ? 'available' : 'unavailable';
        }
    }, { // [28]
        caption: 'Purple Chest',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
        }
    }, { // [29]
        caption: 'Fugitive {flippers}',
        is_opened: false,
        is_available: function() {
            return items.flippers ? 'available' : 'unavailable';
        }
    }, { // [30]
        caption: 'Ether Tablet {sword2}{book}',
        is_opened: false,
        is_available: function() {
            return items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
                items.sword >= 2 ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible' :
                'unavailable';
        }
    }, { // [31]
        caption: 'Bombos Tablet {mirror}{sword2}{book}',
        is_opened: false,
        is_available: function() {
			if (!items.book || !items.mirror)
				return 'unavailable';
			else if (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer)
				return items.sword >= 2 ? 'available' : 'possible';
			else if (can_reach_outcast_with_aga() || (items.moonpearl && items.hammer))
				return agahnim();
			else 
				return 'unavailable';
        }
    }, { // [32]
        caption: 'Catfish',
        is_opened: false,
        is_available: function() {
			if (items.moonpearl && items.glove)
			{
				if (items.hammer || (items.glove == 2 && items.flippers))
					return 'available';
				else
					return agahnim();
			}
			else
				return 'unavailable';
        }
    }, { // [33]
        caption: 'King Zora: {rupee} 500',
        is_opened: false,
        is_available: function() {
            return items.flippers || items.glove ? 'available' : 'unavailable';
        }
    }, { // [34]
        caption: 'Old Man {lantern}',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.lantern ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [35]
        caption: 'Witch {mushroom}',
        is_opened: false,
        is_available: function() {
            return items.mushroom ? 'available' : 'unavailable';
        }
    }, { // [36]
        caption: 'Forest Hideout',
        is_opened: false,
        is_available: always
    }, { // [37]
        caption: 'Lumberjack Tree {agahnim}{boots}',
        is_opened: false,
        is_available: function() {
            return items.agahnim && items.boots ? 'available' : 'possible';
        }
    }, { // [38]
        caption: 'Spectacle Rock Cave',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.lantern || items.flute ? 'available' : 'dark' :
                'unavailable';
        }
    }, { // [39]
        caption: 'South of Grove {mirror}',
        is_opened: false,
        is_available: function() {
			if (!items.mirror)
				return 'unavailable';
			
			if (can_reach_outcast())
				return 'available';
			else if (items.hammer || can_reach_outcast_with_aga())
				return agahnim();
			else
				return 'unavailable';
        }
    }, { // [40]
        caption: 'Graveyard Cliff Cave {mirror}',
        is_opened: false,
        is_available: function() {
			if (!items.mirror)
				return 'unavailable';
			
			if (can_reach_outcast())
				return 'available';
			else if (can_reach_outcast_with_aga())
				return agahnim();
			else
				return 'unavailable';
        }
    }, { // [41]
        caption: 'Checkerboard Cave {mirror}',
        is_opened: false,
        is_available: function() {
            return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
        }
    }, { // [42]
        caption: 'Peg Cave {hammer}',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
        }
    }, { // [43]
        caption: 'Library {boots}',
        is_opened: false,
        is_available: function() {
            return items.boots ? 'available' : 'possible';
        }
    }, { // [44]
        caption: 'Mushroom',
        is_opened: false,
        is_available: always
    }, { // [45]
        caption: 'Spectacle Rock {mirror}',
        is_opened: false,
        is_available: function() {
            return items.glove || items.flute ?
                items.mirror ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible' :
                'unavailable';
        }
    }, { // [46]
        caption: 'Floating Island {mirror}',
        is_opened: false,
        is_available: function() {
            return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
                items.mirror && items.moonpearl && items.glove === 2 ?
                    items.lantern || items.flute ? 'available' : 'dark' :
                    'possible' :
                'unavailable';
        }
    }, { // [47]
        caption: 'Race Minigame {bomb}/{boots}',
        is_opened: false,
        is_available: always
    }, { // [48]
        caption: 'Desert West Ledge {book}/{mirror}',
        is_opened: false,
        is_available: function() {
            return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
        }
    }, { // [49]
        caption: 'Lake Hylia Island {mirror}',
        is_opened: false,
        is_available: function() {
            return items.flippers ?
                items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
                    'available' : 'possible' :
                'unavailable';
        }
    }, { // [50]
        caption: 'Bumper Cave {cape}',
        is_opened: false,
        is_available: function() {
			if (can_reach_outcast())
				return items.glove && items.cape ? 'available' : 'possible';
			else if (can_reach_outcast_with_aga())
				return agahnim();
			else
				return 'unavailable';
        }
    }, { // [51]
        caption: 'Pyramid',
        is_opened: false,
        is_available: function() {
			if (items.glove && items.hammer && items.moonpearl)
				return 'available';
			else if (items.glove == 2 && items.flippers && items.moonpearl)
				return 'available';
			else
				return agahnim();
        }
    }, { // [52]
        caption: 'Digging Game {rupee} 80',
        is_opened: false,
        is_available: function() {
			if (can_reach_outcast() || (items.agahnim && items.moonpearl && items.hammer))
				return 'available';
			else if (can_reach_outcast_with_aga() || (items.moonpearl && items.hammer))
				return agahnim();
			else
				return 'unavailable';
        }
    }, { // [53]
        caption: 'Zora River Ledge {flippers}',
        is_opened: false,
        is_available: function() {
            if (items.flippers) return 'available';
            if (items.glove) return 'possible';
            return 'unavailable';
        }
    }, { // [54]
        caption: 'Dig Spot {shovel}',
        is_opened: false,
        is_available: function() {
            return items.shovel ? 'available' : 'unavailable';
        }
    }, { // [55]
        caption: 'Back of Escape (3) {bomb}/{boots}' + (is_standard ? '' : ' (yellow = need small key)'),
        is_opened: false,
        is_available: function() {
            return is_standard || items.glove ? 'available' :
                items.lantern ? 'possible' : 'dark';
        }
    }, { // [56]
        caption: "Castle Secret Entrance (Uncle + 1)",
        is_opened: is_standard,
        is_available: always
    }, { // [57]
        caption: 'Hyrule Castle Dungeon (3)',
        is_opened: is_standard,
        is_available: always
    }, { // [58]
        caption: 'Sanctuary',
        is_opened: is_standard,
        is_available: always
    }, { // [59]
        caption: 'Mad Batter {hammer}/{mirror} + {powder}',
        is_opened: false,
        is_available: function() {
            return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
        }
    }, { // [60]
        caption: 'Blacksmith',
        is_opened: false,
        is_available: function() {
            return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
        }
    }, { // [61]
        caption: 'Pyramid Fairy {crystal}5 {crystal}6 (2 items)',
        is_opened: false,
        is_available: function() {
            //crystal check
            var crystal_count = 0;
            for (var k = 0; k < 10; k++) {
                if (prizes[k] === 4 && items['boss'+k])
                    crystal_count += 1;
            }

            if (!items.moonpearl || crystal_count < 2) 
				return 'unavailable';
			else if (items.hammer && (items.agahnim || items.glove))
				return 'available';
			else if (items.agahnim && items.mirror && can_reach_outcast())
				return 'available';
			else if (items.hammer || (items.mirror && can_reach_outcast_with_aga()))
				return agahnim();
			else
				return 'unavailable';
        }
    }, { // [62]
        caption: 'Pedestal {pendant0}{pendant1}{pendant2}',
        is_opened: false,
        is_available: function() {
            var pendant_count = 0;
            for (var k = 0; k < 10; k++) {
                if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
                    if (++pendant_count === 3) return 'available';
                }
            }
            return items.book ? 'possible' : 'unavailable';
        }
    }, { // [63]
        caption: 'Sewer {lantern}',
        is_opened: is_standard,
        is_available: function() {
            return is_standard || items.lantern ? 'available' : 'dark';
        }
    }, { // [64]
        caption: 'Waterfall of Wishing (2) {flippers}',
        is_opened: false,
        is_available: function() {
            return items.flippers ? 'available' : 'unavailable';
        }
    }];
}(window));
