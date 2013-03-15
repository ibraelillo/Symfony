<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: Ibrael
 * Date: 15/03/13
 * Time: 10:46
 */

namespace Gwada\GitesBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class TarifaAdmin extends Admin
{
    protected $translation_domain='SonataAdminBundle';


    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('location')
            ->add('alta')
            ->add('media')
            ->add('baja')
            ->add('activo', 'choice', array(
                'choices' =>  array(
                    1 => 'Alta', 2 => 'Media', 3 => 'Baja'
                ), 'expanded' => true
            ))
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('alta')
            ->add('media')
            ->add('baja')
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('precio_actual', 'money', array('template' => 'GitesBundle:Admin:money.html.twig'))
            ->addIdentifier('location', 'Gwada\GitesBundle\Entity\Location')
            ->add('alta', 'money', array('template' => 'GitesBundle:Admin:money.html.twig'))
            ->add('media', 'money', array('template' => 'GitesBundle:Admin:money.html.twig'))
            ->add('baja', 'money', array('template' => 'GitesBundle:Admin:money.html.twig'))
        ;
    }

}