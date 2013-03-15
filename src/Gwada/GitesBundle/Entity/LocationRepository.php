<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: Ibrael
 * Date: 7/03/13
 * Time: 5:20
 */
namespace Gwada\GitesBundle\Entity;

use Doctrine\ORM\EntityRepository;

class LocationRepository extends EntityRepository
{

    public function findCercanas($location_id)
    {
        $em = $this->getEntityManager();
        $consulta = $em->createQuery('
                SELECT c
                FROM LocationBundle:Location c
                WHERE c.id != :id
                ORDER BY c.nombre ASC');

        $consulta->setMaxResults(5);
        $consulta->setParameter('id', $location_id);

        return $consulta->getResult();
    }

}
