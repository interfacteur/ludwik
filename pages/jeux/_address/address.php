<?php
$page = (count($_GET) > 0 && ! empty($_GET["page"])) ? htmlentities($_GET["page"]) : "vide";
$pages = array(
	"vide" => '',
	"tailles" => '<a href="http://interfacteur.blogspot.fr/2015/06/jeux-d-oiseaux-2-jeu-tailles.html">jeu des tailles</a> ; ',
	"cache" => '<a href="http://interfacteur.blogspot.fr/2015/06/jeux-d-oiseaux-3-cache-cache.html">jeu de cache-cache</a> ; ',
	"puzzle" => '<a href="http://interfacteur.blogspot.fr/2015/06/jeux-d-oiseaux-4-puzzle.html">puzzle</a> ; ',
	"milieux" => '<a href="http://interfacteur.blogspot.fr/2015/06/jeux-d-oiseaux-5-jeu-milieux.html">jeu des milieux</a> ; '
);
$depots = array(
	"vide" => '',
	"tailles" => '<a href="https://github.com/interfacteur/ludwik/blob/master/jeu-tailles.js">dépôt</a> sur ',
	"cache" => '<a href="https://github.com/interfacteur/ludwik/blob/master/jeu-cache.js">dépôt</a> sur ',
	"puzzle" => '<a href="https://github.com/interfacteur/ludwik/blob/master/jeu-puzzle.js">dépôt</a> sur ',
	"milieux" => '<a href="https://github.com/interfacteur/ludwik/blob/master/jeu-milieux.js">dépôt</a> sur '
)
?>
<address class="address" <?php if (isset($lang)) { echo 'lang="fr"'; } ?>>
	Notes de présentation : <?php echo $pages[$page]; ?>
	<a href="http://interfacteur.blogspot.fr/2015/06/jeux-d-oiseaux-1-presentation.html">tous les jeux</a> -<br>
	<?php if (! isset($modele)) { echo $depots[$page]; } ?>
	<a href="https://github.com/interfacteur/ludwik">Github</a> -<br>
	<a href="http://gaetan.langhade.net">Gaëtan Langhade, Interfacteur</a> -<br>
	pour <a href="http://www.ludwik.fr/">Ludwik</a><br>
</address>