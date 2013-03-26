<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: Ibrael
 * Date: 7/03/13
 * Time: 2:45
 */
namespace Gwada\GitesBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Gwada\GitesBundle\Entity\Location;
use Gwada\GitesBundle\Entity\Tarifa;


class LocationFixtures extends \Doctrine\Common\DataFixtures\AbstractFixture implements \Doctrine\Common\DataFixtures\OrderedFixtureInterface
{

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param Doctrine\Common\Persistence\ObjectManager $manager
     */
    function load(ObjectManager $manager)
    {
        $locations = array(
           array(
               'nombre' => "Villa Thomanon",
               'capacidad' => 9,
               'descripcion'=> array(
                    "Villa spacieuse très bien équipée",
                    "3 chambres climatisées",
                    "Séjour avec grand canapé, écran plasma avec chaines canalsat, home cinema, bureau",
                    "Cuisine équipée d'un frigo américain, lave vaisselle, plaque vitro, microonde, senseo",
                    "Salle de bain avec baignoire, double lavabo, lave linge, 2wc",
                    "Terrasse couverte avec salon en teck",
                    "Acces direct a la piscine sécurisée par alarme et internet wifi"
               ),
               'tarifa' => array(
                   'baja' => 750, 'media' => 900, 'alta' => 1050, 'activa' => 1
               )
           ),
            array(
                'nombre' => "Grand Bungalow", 'capacidad' => 8, 'precio_base'=> 850,
                'descripcion'=> array(
                    "Une chambre familiale (un lit double et deux lits simples) climatisée.",
                    "Une chambre avec lit double, télé, coffre fort climatisée.",
                    "Une mezzanine ouverte avec couchage double",
                    "Deux salles de bains complétes (lavabo douche wc)",
                    "Pièce de vie avec canapé clic clac et télévision",
                    "Coin cuisine équipée comprenant lave vaisselle, grand frigo congel, mini four, etc",
                    "Terrasse couverte sans vis à vis avec salon de jardin en teck, barbecue, etc",
                    "Accès à la piscine du complexe sur le devant"
                ),
                'tarifa' => array(
                    'baja' => 450, 'media' => 600, 'alta' => 750, 'activa' => 1
                )
            ),
            array(
                'nombre' => "Bungalow Vert", 'capacidad' => 5, 'precio_base'=> 700,
                'descripcion'=> array(
                    "Chambre climatisée avec lit double télévision et coffre fort",
                    "Mezzanine avec lit double et un couchage enfant (accés echelle meunier)",
                    "Salle de bain (lavabo douche wc)",
                    "Pièce de vie ouverte avec coin cuisine équipée (microonde, grand frigo congel, plaque gaz...)",
                    "Terrasse extérieure en teck avec salon de jardin, barbecue et transat",
                    "Accès à la piscine du complexe et connexion internet par wifi",
                    "Mitoyen avec le @Grand Bungalow"
                ),
                'tarifa' => array(
                    'baja' => 280, 'media' => 380, 'alta' => 480, 'activa' => 1
                )
            ),
            array(
                'nombre' => "Studio Jaune", 'capacidad' => 4, 'precio_base'=> 450,
                'descripcion'=> array(
                    "Gite studio climatisé comprenant un lit double, télévision, armoire penderie, etc..",
                    "Coin cuisine avec kitchenette (frigo top, microonde, plaque gaz, évier, plan de travail, rangement, etc..",
                    "Coin détente avec canapé clic clac et table basse",
                    "Terrasse en teck à l'extérieur avec salon de jardin barbecue..",
                    "Accès à la piscine du complexe et connexion internet par wifi",
                ),
                'tarifa' => array(
                    'baja' => 230, 'media' => 330, 'alta' => 380, 'activa' => 1
                )
            ),
            array(
                'nombre' => "Studio Bleu", 'capacidad' => 2, 'precio_base'=> 350,
                'descripcion'=> array(
                    "Gite type 1 avec chambre climatisée, lit double, rangement penderie, télévision..",
                    "Salle de bain compléte (lavabo douche wc)",
                    "Pièce de vie avec coin cuisine (kitchenette compléte, plan de travail, vaisselle et rangement",
                    "Petite terrasse extérieure en pierre de bavière avec salon de jardin, barbecue",
                    "Accès à la piscine du complexe et connexion internet par wifi"
                ),
                'tarifa' => array(
                    'baja' => 230, 'media' => 330, 'alta' => 380, 'activa' => 1
                )
            )
        );

        foreach($locations as $loc)
        {

            $t = new Tarifa();
            $t
                ->setActivo($loc['tarifa']['activa'])
                ->setBaja($loc['tarifa']['baja'])
                ->setMedia($loc['tarifa']['media'])
                ->setAlta($loc['tarifa']['alta']);

            $l = new Location();
            $l
                ->setCapacidad($loc['capacidad'])
                ->setDescripcion(implode(".\n",$loc['descripcion']))
                ->setNombre($loc['nombre'])
                ->setPrecioBase($t)
                ->setDireccion('Dubedou, Saint François 97806, Guadeloupe')
            ;

            $manager->persist($l);
        }



        $manager->flush();
    }

    /**
     * Get the order of this fixture
     *
     * @return integer
     */
    function getOrder()
    {
        return 2;
    }
}
