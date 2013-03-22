<?php

namespace Gwada\GitesBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ReservacionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email')
            ->add('telefono')
            ->add('nombre')
            ->add('fecha_entrada')
            ->add('fecha_publicacion')
            ->add('fecha_salida')
            ->add('capacidad')
            ->add('confirmada')
            ->add('atendida')
            ->add('location')
        ;
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => 'Gwada\GitesBundle\Entity\Reservacion',
            'csrf_protection'   => false,
        ));
    }

    public function getName()
    {
        return 'gwada_gitesbundle_reservaciontype';
    }
}
