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

    public function findAllOrdered($order = array(), $max = -1)
    {
        $query = $this->createQueryBuilder('l')
            ->select('l, t, g, gh, m')
            ->leftJoin('l.precio_base', 't')
            ->leftJoin('l.gallery', 'g')
            ->leftJoin('g.galleryHasMedias', 'gh')
            ->leftJoin('gh.media', 'm')
        ;

        foreach($order as $campo => $direccion){
            switch($campo){
                case 'precio_base':
                    $query->addOrderBy('t.alta', $direccion);
                    break;
                default: $query->addOrderBy('l.'.strtolower($campo), strtoupper($direccion));
                    break;
            }
        }


        $max > 0 ? $query->setMaxResults($max) : '';

        return $query->getQuery()->getResult();
    }

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
