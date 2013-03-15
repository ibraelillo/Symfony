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

class LocationAdmin extends Admin
{
    protected $translation_domain='SonataAdminBundle';

    protected $datagridValues = array(
        '_page' => 1, // Display the first page (default = 1)
        '_sort_order' => 'DESC', // Descendant ordering (default = 'ASC')
        '_sort_by' => 'precio' // name of the ordered field (default = the model id field, if any)
        // the '_sort_by' key can be of the form 'mySubModel.mySubSubModel.myField'.
    );

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('nombre')
            ->add('direccion')
            ->add('capacidad')
            ->add('descripcion')
            ->add('precio_base')
            ->add('gallery')
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
            ->addIdentifier('nombre')
            ->add('direccion')
            ->add('capacidad')
            ->add('precio', 'money')
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