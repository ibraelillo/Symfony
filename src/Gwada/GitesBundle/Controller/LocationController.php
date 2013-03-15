<?php

namespace Gwada\GitesBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Gwada\GitesBundle\Entity\Location;

/**
 * Location controller.
 *
 */
class LocationController extends Controller
{
    /**
     * Lists all Location entities.
     *
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('GitesBundle:Location')->findAll();

        return $this->render('GitesBundle:Location:index.html.twig', array(
            'entities' => $entities,
        ));
    }

    /**
     * Finds and displays a Location entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('GitesBundle:Location')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Location entity.');
        }

        return $this->render('GitesBundle:Location:show.html.twig', array(
            'entity'      => $entity,
        ));
    }

}
