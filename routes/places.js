var express = require('express');
var router = express.Router();

const Place = require('../models/places');
const Comment = require('../models/comments');
const User = require('../models/users');



// FAVORIS *************
// Route Get : /places/displayFavoris
// Affiche la liste des lieux en favoris

// Route Delete : /places/deleteFavoris/ :id 
// On supprime un lieu des favoris via son ID

// Screen Map **********
// Route Get : /places
// Affichage des lieux (sous forme de tableau) présents en base de données en fonction du nombre de référencements (affiché si supérieur à 10). 
router.get("/", async (req, res) => {
	const allPlaces = await Place.find();
	res.json({ result: true, allPlaces: allPlaces });
})

// POP UP LIEU --- AJOUTER *************
// Un lieu est rajouté dans la base de données s’il n’existe pas encore.
router.post('/addPlace', async (req, res) => {
	const place = await Place.findOne({ name: req.body.name })
	const comment = await Comment.findOne({ token: req.body.token })
	if (place) { //si le lieu est déjà enregistré dans la bdd
		res.json({ result: false, error: "Lieu déjà enregistré" });
		return;
	} else if (comment) { // si l'utilisateur laisse un premier avis
		const newPlace = new Place({
			name: req.body.name,
			type: req.body.type,
			adress: req.body.adress,
			feedback: [req.body.userToken],
			sizeAccepted: req.body.size,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			comments: [comment._id]
		})
		const result = await newPlace.save()
		res.json({ message: 'Lieu ajouté avec succès', place: result });
	} else { // si jamais l'utilisateur ne laisse pas de premier avis
		const newPlace = new Place({
			name: req.body.name,
			type: req.body.type,
			adress: req.body.adress,
			feedback: [req.body.userToken],
			sizeAccepted: req.body.size,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
		})
		const result = await newPlace.save()
		res.json({ message: 'Lieu ajouté avec succès', place: result });
	}
})

//Obtenir tous les commentaires d'un lieu
router.get('/comments/:placeName', async (req, res) => {
	const allComments = await Place.findOne({ name: req.params.placeName }).populate({
		path: 'comments', 
		populate: {
			path: 'user',   
			select: 'username avatar dogs'  
		}
	});
	res.json({ message: 'Listes des commentaires trouvé avec succès', comments: allComments.comments })
})


// Route Put : /places/ addFeedback/ :id
// Modifie le nombre de feedback et la taille du chien.

// Route Put : /places/favoris/ :id 
// Grâce à l’ID du lieu on le rajoute aux favoris


module.exports = router;




