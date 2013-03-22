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
use Gwada\GitesBundle\Entity\Reservacion;
use Gwada\GitesBundle\Entity\Tarifa;


class ReservationFixtures extends \Doctrine\Common\DataFixtures\AbstractFixture implements \Doctrine\Common\DataFixtures\OrderedFixtureInterface
{

    /**
     * Load data fixtures with the passed EntityManager
     *
     * @param Doctrine\Common\Persistence\ObjectManager $manager
     */
    function load(ObjectManager $manager)
    {
        $locations = $manager->getRepository('GitesBundle:Location')->findAll();

        foreach($locations as $loc){

            for($i = 0; $i < 10; $i++){
                $res = new Reservacion();
                $fecha_entrada = $i == 0 ? new \DateTime("now") : new \DateTime("today + ".ceil(rand(0, 30))." days");
                $fecha_salida = clone $fecha_entrada;
                $fecha_salida->add(new \DateInterval('P'.ceil(rand(5,40)).'D'));


                print sprintf("%s: %s -> %s\n", $loc->getSlug(), $fecha_entrada->format("Y-m-d"), $fecha_salida->format('Y-m-d'));

                $res
                    ->setLocation($loc)
                    ->setNombre('pepe')
                    ->setAtendida($i % 2 == 0)
                    ->setCapacidad(ceil(rand(1, $loc->getCapacidad())))
                    ->setFechaEntrada($fecha_entrada)
                    ->setFechaSalida($fecha_salida)
                    ->setEmail('pepe@gmail.com')
                    ->setTelefono(ceil(rand(6000000, 7000000)))
                    ->setConfirmada($i % 3 == 0)
                ;

                $manager->persist($res);
            }
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
        return 20;
    }
}
