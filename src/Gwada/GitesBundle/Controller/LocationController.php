<?php

namespace Gwada\GitesBundle\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Gwada\GitesBundle\Entity\Location;
use Symfony\Component\HttpFoundation\JsonResponse;

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

        $entities = $em->getRepository('GitesBundle:Location')->findAllOrdered(array('precio_base'=> 'desc', 'capacidad' => 'desc'));

        if($this->getRequest()->isXmlHttpRequest())
        {
            return $this->render('GitesBundle:Location:index.json.twig', array(
                'entities' => $entities,
            ), new JsonResponse());
        }


        return $this->render('GitesBundle:Location:index.html.twig', array(
            'entities' => $entities,
        ));
    }

    /**
     * Finds and displays a Location entity.
     *
     */
    public function showAction($slug)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('GitesBundle:Location')->findOneBySlug($slug);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Location entity.');
        }

        if($this->getRequest()->isXmlHttpRequest())
        {
            return $this->render('GitesBundle:Location:show.json.twig', array(
                'e' => $entity,
            ), new JsonResponse());
        }
        else{
            return $this->redirect($this->generateUrl("portada")."#!/location/".$entity->getSlug());
        }

        return $this->render('GitesBundle:Location:show.html.twig', array(
            'entity'      => $entity,
        ));
    }

}
