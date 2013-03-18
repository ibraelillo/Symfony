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
                $res
                    ->setLocation($loc)
                    ->setNombre('pepe')
                    ->setAtendida($i % 2 == 0)
                    ->setCapacidad(ceil(rand(1, $loc->getCapacidad())))
                    ->setFechaEntrada($i == 0 ? new \DateTime('now') : new \DateTime(
                        sprintf("today + %s days", ceil(rand(0, 30)))
                    ))
                    ->setFechaSalida(
                        $res->getFechaEntrada()->add(
                            new \DateInterval(sprintf(
                                "%s days", ceil(rand(0,20))
                            ))
                        )
                    )
                    ->setEmail('pepe@gmail.com')
                    ->setTelefono(ceil(rand(6000000, 7000000)))
                    ->setConfirmada($i % 3 == 0)
                ;

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
