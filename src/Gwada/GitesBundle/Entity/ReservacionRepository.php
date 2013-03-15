<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: Ibrael
 * Date: 7/03/13
 * Time: 5:20
 */
namespace Gwada\GitesBundle\Entity;

use Doctrine\ORM\EntityRepository;

class ReservacionRepository extends EntityRepository
{

    public function findDisponible($location_id, $entrada, $salida)
    {

        /*$dql = "
            SELECT r
            FROM LocationBundle:Reservacion r
            WHERE r.location = :location_id
                    AND r.confirmada = true
                    AND (
                        :entrada > r.fecha_entrada AND  :entrada < r.fecha_salida
                        OR
                        :salida > r.fecha_entrada AND :salida < r.fecha_salida
                        )
        ";


        $qb = $this->getEntityManager()->createQuery($dql)
            ->setParameters(array(
                'location_id' => $location_id,
                'salida' => $salida,
                'entrada' => $entrada
            ))
        ;

        return $qb->execute();
        */

        return $qb= $this->createQueryBuilder('r')
            ->select('r')
            ->where('r.confirmada = true')
            ->andWhere('r.location = :location_id')
            ->andWhere('(:entrada between r.fecha_entrada AND r.fecha_salida) OR (:salida between r.fecha_entrada and r.fecha_salida) ')
            ->setParameters(array(
                'location_id' => $location_id,
                'salida' => $salida,
                'entrada' => $entrada
            ))->getQuery()->getResult();
    }

}
