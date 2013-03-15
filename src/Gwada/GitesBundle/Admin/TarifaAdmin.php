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
            ->add('enabled', null, array('required' => false))
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('nombre')
            ->add('direccion')
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('location')
            ->add('alta')
            ->add('media')
            ->add('baja')
        ;
    }

    public function getTemplate($name)
    {
        switch ($name) {
            case 'money':
                return 'GitesBundle:Admin:money.html.twig';
                break;
            default:
                return parent::getTemplate($name);
                break;
        }
    }
}