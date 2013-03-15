<?php

namespace Gwada\GitesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{



    public function indexAction($name)
    {
        return $this->render('GitesBundle:Default:index.html.twig', array('name' => $name));
    }

    public function estaticaAction($tpl)
    {
        return $this->render('GitesBundle:Default:'.$tpl.'.html.twig');
    }
}
