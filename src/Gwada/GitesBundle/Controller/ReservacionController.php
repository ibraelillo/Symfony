<?php

namespace Gwada\GitesBundle\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use Gwada\GitesBundle\Entity\Reservacion;
use Gwada\GitesBundle\Form\ReservacionType;

/**
 * Reservacion controller.
 *
 */
class ReservacionController extends Controller
{
    /**
     * Lists all Reservacion entities.
     *
     */
    public function indexAction($slug, $entrada = null, $salida = null)
    {
        $em = $this->getDoctrine()->getManager();


        $location = $em->getRepository('GitesBundle:Location')->findOneBySlug($slug);

        $entities = $em->getRepository('GitesBundle:Reservacion')->findDisponible($location->getId());

        if($this->getRequest()->isXmlHttpRequest())
        {
            return $this->render('GitesBundle:Reservacion:index.json.twig', array(
                'entities' => $entities,
            ), new JsonResponse());
        }

        return $this->render('GitesBundle:Reservacion:index.html.twig', array(
            'entities' => $entities,
        ));
    }

    /**
     * Creates a new Reservacion entity.
     *
     */
    public function createAction($slug)
    {

        $request = $this->getRequest();

        $em = $this->getDoctrine()->getManager();


        $location = $em->getRepository('GitesBundle:Location')->findOneBySlug($slug);

        $entity  = new Reservacion();
        if($request->isXmlHttpRequest()){

            if(count($request->request->all()) == 0){
                $res = json_decode($request->getContent());


                $entrada = new \DateTime($res->fecha_entrada);
                $salida = new \DateTime($res->fecha_salida);

                //$salida->

                $entity
                    ->setAtendida(false)
                    ->setCapacidad($res->capacidad)
                    ->setConfirmada(isset($res->confirmada) && $res->confirmada)
                    ->setEmail($res->email)
                    ->setFechaEntrada($entrada)
                    ->setFechaSalida($salida)
                    ->setFechaPublicacion(new \Datetime("now"))
                    ->setTelefono($res->telefono)
                    ->setLocation($location)
                    ->setNombre((isset($res->Titre) ? $res->Titre : '').' '.$res->nombre)
                ;
            }
            else{
                $entity
                    ->setAtendida(false)
                    ->setCapacidad($request->get('capacidad'))
                    ->setConfirmada($request->get('confirmada', false))
                    ->setEmail($request->get('email'))
                    ->setFechaEntrada($entrada)
                    ->setFechaSalida($salida)
                    ->setFechaPublicacion(new \Datetime("now"))
                    ->setTelefono($request->get('telefono'))
                    ->setLocation($location)
                    ->setNombre($request->get('Titre', '').' '.$request->get('nombre'))
                ;
            }

            $em->persist($entity);
            $em->flush();
            return $this->redirect($this->generateUrl('location_reservaciones_show', array('slug'=>$slug, 'id' => $entity->getId())));
        }else {

            $form = $this->createForm(new ReservacionType(), $entity);

            $form->bind($request);

            if ($form->isValid()) {
                $em = $this->getDoctrine()->getManager();
                $em->persist($entity);
                $em->flush();


                $message = \Swift_Message::newInstance()
                    ->setSubject(sprintf(
                        "Réserve #%s pour %s", $entity->getId(), $entity->getLocation()
                    ))
                    ->setFrom(array('avisos@casasthomanon.com' =>"Casas Thomanon"))
                    ->setTo($this->container->getParameter('web_contact'))
                    ->setContentType('text/html')
                    ->setBody(
                        $this->renderView(
                            'GitesBundle:Reservation:show.html.twig',
                            array('entity' => $entity)
                        ), 'text/html'
                    )
                ;
                $this->get('mailer')->send($message);



                return $this->redirect($this->generateUrl('location_reservaciones_show', array('slug'=>$slug, 'id' => $entity->getId())));
            }
        }

        return $this->render('GitesBundle:Reservacion:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));

    }

    /**
     * Displays a form to create a new Reservacion entity.
     *
     */
    public function newAction()
    {
        $entity = new Reservacion();
        $form   = $this->createForm(new ReservacionType(), $entity);

        return $this->render('GitesBundle:Reservacion:new.html.twig', array(
            'entity' => $entity,
            'form'   => $form->createView(),
        ));
    }

    /**
     * Finds and displays a Reservacion entity.
     *
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('GitesBundle:Reservacion')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Reservacion entity.');
        }

        if($this->getRequest()->isXmlHttpRequest())
        {
            return $this->render('GitesBundle:Reservacion:show.json.twig', array(
                'r' => $entity,
            ), new JsonResponse());
        }

        $deleteForm = $this->createDeleteForm($id);

        return $this->render('GitesBundle:Reservacion:show.html.twig', array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),        ));
    }

    /**
     * Displays a form to edit an existing Reservacion entity.
     *
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('GitesBundle:Reservacion')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Reservacion entity.');
        }

        $editForm = $this->createForm(new ReservacionType(), $entity);
        $deleteForm = $this->createDeleteForm($id);

        return $this->render('GitesBundle:Reservacion:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Edits an existing Reservacion entity.
     *
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('GitesBundle:Reservacion')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Reservacion entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createForm(new ReservacionType(), $entity);
        $editForm->bind($request);

        if ($editForm->isValid()) {
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('location_{id}_reservaciones_edit', array('id' => $id)));
        }

        return $this->render('GitesBundle:Reservacion:edit.html.twig', array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a Reservacion entity.
     *
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->bind($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('GitesBundle:Reservacion')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Reservacion entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('location_{id}_reservaciones'));
    }

    /**
     * Creates a form to delete a Reservacion entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder(array('id' => $id))
            ->add('id', 'hidden')
            ->getForm()
        ;
    }
}
