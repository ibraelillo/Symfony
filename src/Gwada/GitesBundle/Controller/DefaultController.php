<?php

namespace Gwada\GitesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{



    public function indexAction()
    {
        return $this->render('GitesBundle:Default:index.html.twig');
    }

    public function estaticaAction($tpl)
    {
        return $this->render('GitesBundle:Default:'.$tpl.'.html.twig');
    }

    public function sitemapAction()
    {
        $em = $this->getDoctrine()->getManager();

        $locations = $em->getRepository('GitesBundle:Location')->findAll();
        $response = new Response();
        $response->headers->set('Content-Type', 'xml');



        return $this->render('::sitemap.xml.twig', array(
            'locations' => $locations
        ), $response);
    }
}
