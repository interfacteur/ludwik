/*
classement par taille des 13 oiseaux :
fauvette	13
alouette	14,25
bruant		16
pipit		16,5
ptduc		20
engoulevent	27
faucon		30
rollier		31
outarde		42,5
aigle		60
vautour		60
circaete	66
gdduc		67,5

4 séries :
fauvette	13		alouette	14,25		bruant		16		fauvette	13
ptduc		20		pipit		16,5		engoulevent	27		pipit		16,5
rollier		31		outarde		42,5		faucon		30		faucon		30
aigle		60		circaete	66			vautour		60		gdduc		67,5

NOTES :

	150313 nom des clés régularisé sur le nom des fichiers images

	150403 nom des clés régularisé sur première partie du nom (d'où régularisation images et sons)
		bruant, faucon, fauvette, vautour
*/

window.oiseaux = {

	aigle: { //AB
		param: {
			taille: 60,
			imgRatio: 49,
			imgSource: "img/jeu-tailles/aigle.png",
			jeux: [1]
		},
		Nom: "Aigle de Bonelli",
		Pronominal: "l'Aigle de Bonelli",
		Groupe: "Rapace diurne",
		Longueur: "55 à 65 cm",
		Envergure: "1,45 à 1,70 m",
		Poids: "1,5 à 2,5 kg",
		Longévité: "25 à 30 ans",
		Habitats: "Falaises (nidification), garrigues et cultures (alimentation)",
		Migrateur: "Sédentaire",
		Alimentation: "Carnivore (petits mammifères et oiseaux)",
		Alpilles: "4 couples"
	},
	alouette: { //AL
		param: {
			taille: 14.25,
			imgRatio: 12.5,
			imgSource: "img/jeu-tailles/alouette.png",
			jeux: [2]
		},
		Nom: "Alouette lulu",
		Pronominal: "l'Alouette lulu",
		Groupe: "Passereaux",
		Longueur: "13,5 à 15 cm",
		Envergure: "28 à 30 cm",
		Poids: "25 à 35 g",
		Longévité: "Maximum 9 ans",
		Habitats: "Milieux ouverts, secs et chauds (garrigues, pelouses, etc.)",
		Migrateur: "Non migrateur en région PACA",
		Alimentation: "Insectivore, mais aussi araignées ; graines (en hiver)dd",
		Alpilles: "Espèce largement répandue"
	},
	bruant: { //BO
		param: {
			taille: 16,
			imgRatio: 15,
			imgSource: "img/jeu-tailles/bruant.png",
			jeux: [3]
		},
		Nom: "Bruant ortolan",
		Pronominal: "le Bruant ortolan",
		Groupe: "Passereaux",
		Longueur: "15 à 17 cm",
		Envergure: "24 à 27 cm",
		Poids: "16 à 30 g",
		Longévité: "10 ans",
		Habitats: "Milieux ouverts, ensoleillés, chauds et secs (garrigues, pelouses, etc.)",
		Migrateur: "Hivernage en Afrique tropicale",
		Alimentation: "Insectivore, aussi chenilles ; graines (en hiver)",
		Alpilles: "Il y en a très peu (deux mâles chanteurs au maximum en 2014)"
	},
	circaete: { //CJ
		param: {
			taille: 66,
			imgRatio: 54.4,
			imgSource: "img/jeu-tailles/circaete.png",
			jeux: [2]
		},
		Nom: "Circaète Jean-le-Blanc",
		Pronominal: "le Circaète Jean-le-Blanc",
		Groupe: "Rapace diurne",
		Longueur: "62 à 70 cm",
		Envergure: "1,62 à 1,80 m",
		Poids: "1,2 à 2 kg (mâle), 1,3 à 2,3 kg (femelle)",
		Longévité: "17 ans",
		Habitats: "Forêts (nidification), milieux ouverts et agricoles (alimentation)",
		Migrateur: "Hivernage en Afrique subsaharienne",
		Alimentation: "Carnivore - surtout des reptiles (serpents, lézards...) mais aussi de petits mammifères, batraciens, oiseaux et insectes",
		Alpilles: "8 à 10 couples (estimation)"
	},
	engoulevent: { //EE
		param: {
			taille: 27,
			imgRatio: 28.4,
			imgSource: "img/jeu-tailles/engoulevent.png",
			jeux: [3]
		},
		Nom: "Engoulevent d'Europe",
		Pronominal: "l'Engoulevent d'Europe",
		Groupe: "Engoulevents",
		Longueur: "26 à 28 cm",
		Envergure: "52 à 60 cm",
		Poids: "50 à 110 g",
		Longévité: "8 ans",
		Habitats: "Garrigues ouvertes et bois clairsemés",
		Migrateur: "Hivernage en Afrique tropicale (migration nocturne)",
		Alimentation: "Insectivore, aussi papillons nocturnes, coléoptères et fourmis ailées",
		Alpilles: "Espèce bien représentée"
	},
	faucon:	{ //FC
		param: {
			taille: 30,
			imgRatio: 25.4,
			imgSource: "img/jeu-tailles/faucon.png",
			jeux: [3, 4]
		},
		Nom: "Faucon crécerellette",
		Pronominal: "le Faucon crécerellette",
		Groupe: "Rapace diurne",
		Longueur: "27 à 33 cm",
		Envergure: "63 à 72 cm",
		Poids: "130 à 150 g (mâle), 160 à 200 g (femelle)",
		Longévité: "6 ans",
		Habitats: "Bâtiments (nidification), garrigues basses et milieux cultivés (alimentation)",
		Migrateur: "Hivernage en Afrique sahélienne (Sénégal, Mali, Niger, Tchad, Nigeria)",
		Alimentation: "Insectivore, aussi scolopendres. Criquets, sauterelles et cigales pour les poussins.",
		Alpilles: "Depuis le début des années 1990, l'espèce ne se reproduit plus dans les Alpilles."
	},
	fauvette: { //FP
		param: {
			taille: 13,
			imgRatio: 12.1,
			imgSource: "img/jeu-tailles/fauvette.png",
			jeux: [1, 4]
		},
		Nom: "Fauvette pitchou",
		Pronominal: "la Fauvette pitchou",
		Groupe: "Passereaux",
		Longueur: "12 à 14 cm",
		Envergure: "12 à 15 cm",
		Poids: "8 à 12 g",
		Longévité: "5 ans",
		Habitats: "Garrigues, milieux buissonneux parsemés d'arbustes",
		Migrateur: "Sédentaire",
		Alimentation: "Insectivore, aussi scorpions, araignées ; fruits et graines en automne/hiver",
		Alpilles: "Espèce largement répandue"
	},
	gdduc: { //GE
		param: {
			taille: 67.5,
			imgRatio: 54, // 63.7,
			imgSource: "img/jeu-tailles/gdduc.png",
			jeux: [4]
		},
		Nom: "Grand-duc d'Europe",
		Pronominal: "le Grand-duc d'Europe",
		Groupe: "Rapace nocturne",
		Longueur: "60 à 75 cm",
		Envergure: "1,40 à 1,70 m",
		Poids: "2 kg à 2,7 kg (mâle) 2,5 à 3,5 kg (femelle)",
		Longévité: "Plus de 20 ans",
		Habitats: "Falaises (nidification), milieux mixtes ouverts (alimentation)",
		Migrateur: "Sédentaire",
		Alimentation: "Carnivore (rats, lapins de Garenne, hérissons, lièvres et petits mammifères)",
		Alpilles: "Espèce bien représentée"
	},
	outarde: { //OC
		param: {
			taille: 42.5,
			imgRatio: 43.8,
			imgSource: "img/jeu-tailles/outarde.png",
			jeux: [2]
		},
		Nom: "Outarde canepetière",
		Pronominal: "l'Outarde canepetière",
		Groupe: "Outardes",
		Longueur: "40 à 45 cm",
		Envergure: "83 à 110 cm",
		Poids: "2 kg à 2,7 kg (mâle) 2,5 à 3,5 kg (femelle)",
		Longévité: "16 ans",
		Habitats: "Milieux agricoles ouverts, friches, prairies",
		Migrateur: "Non migrateur en région PACA",
		Alimentation: "Insectivore et herbivore (pousses, feuilles et inflorescences)",
		Alpilles: "10 couples maximum"
	},
	pipit: { //PR
		param: {
			taille: 16.5,
			imgRatio: 13.8,
			imgSource: "img/jeu-tailles/pipit.png",
			jeux: [2, 4]
		},
		Nom: "Pipit rousseline",
		Pronominal: "le Pipit rousseline",
		Groupe: "Passereaux",
		Longueur: "15 à 18 cm",
		Envergure: "20 à 28 cm",
		Poids: "25 à 30 g",
		Longévité: "5 ans",
		Habitats: "Milieux ouverts à végétation rase et dans les cultures de vignes ou de lavande",
		Migrateur: "Hivernage en Afrique subsaharienne",
		Alimentation: "Insectivore (criquets, sauterelles, termites) aussi araignées, scorpions et graines (en hiver)dd",
		Alpilles: "Espèce bien représentée"
	},
	ptduc: { //PS
		param: {
			taille: 20,
			imgRatio: 20.5,
			imgSource: "img/jeu-tailles/ptduc.png",
			jeux: [1]
		},
		Nom: "Petit-duc scops",
		Pronominal: "le Petit-duc scops",
		Groupe: "Rapace nocturne",
		Longueur: "19 à 21 cm",
		Envergure: "47 à 54 cm",
		Poids: "75 à 80 g (mâle), 90 à 95 g (femelle)",
		Longévité: "6 ans",
		Habitats: "Milieux semi-ouverts pourvus de vieux arbres creux",
		Migrateur: "Hivernage en Afrique subsaharienne et au sud de l'Espagne, de l'Italie, de la Grèce",
		Alimentation: "Insectivore, aussi araignées, petits mammifères et petits oiseaux",
		Alpilles: "Nombre mal connu"
	},
	rollier: { //RE
		param: {
			taille: 31,
			imgRatio: 23.4,
			imgSource: "img/jeu-tailles/rollier.png",
			jeux: [1]
		},
		Nom: "Rollier d'Europe",
		Pronominal: "le Rollier d'Europe",
		Groupe: "Rolliers",
		Longueur: "30 à 32 cm",
		Envergure: "52 à 60 cm",
		Poids: "110 à 160 g",
		Longévité: "9 ans",
		Habitats: "Cavités (nidification), milieux ouverts pourvus de perchoirs (alimentation)",
		Migrateur: "Hivernage en Afrique de l'Est",
		Alimentation: "Insectivore, aussi araignées, scolopendres, scorpions, reptiles, petits mammifères et batraciensdd",
		Alpilles: "Espèce bien représentée"
	},
	vautour: { //VP
		param: {
			taille: 60,
			imgRatio: 49.7,
			imgSource: "img/jeu-tailles/vautour.png",
			jeux: [3]
		},
		Nom: "Vautour percnoptère",
		Pronominal: "le Vautour percnoptère",
		Groupe: "Rapace diurne",
		Longueur: "55 à 65 cm",
		Envergure: "1,55 à 1,70 m",
		Poids: "2 à 2,5 kg",
		Longévité: "environ 30 ans",
		Habitats: "Falaises (nidification), garrigues et cultures (alimentation)",
		Migrateur: "Hivernage en Afrique subsaharienne",
		Alimentation: "Charognard (petits reptiles ou mammifères morts) et coprophage (excréments)dd",
		Alpilles: "Un seul couple"
	}
}
