<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: Ibrael
 * Date: 7/03/13
 * Time: 2:11
 */
namespace Gwada\GitesBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use Application\Sonata\MediaBundle\Entity\Gallery;
use Gwada\GitesBundle\Entity\Tarifa;
use Gwada\GitesBundle\Entity\Reservacion;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity(repositoryClass="Gwada\GitesBundle\Entity\LocationRepository")
 * @ORM\HasLifecycleCallbacks
 */
class Location
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=100)
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     */
    protected $nombre;

    /** @ORM\Column(type="string", length=100) */
    protected $direccion;

    /** @ORM\OneToOne(targetEntity="Tarifa", inversedBy="location", cascade="persist")*/
    protected $precio_base;

    /** @ORM\Column(type="integer") */
    protected $capacidad;

    /**
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     * @Assert\Length(min = 30)
     */
    protected $descripcion;

    /**
     * @ORM\Column(type="string", length=100, unique=true)
     * @Assert\NotBlank()
     * @Gedmo\Slug(fields={"nombre"}, updatable=false, separator="-")
     */
    protected $slug;

    /**
     * @ORM\OneToOne(targetEntity="Application\Sonata\MediaBundle\Entity\Gallery", cascade={"persist","remove"}, orphanRemoval=true)
     * @ORM\JoinColumn(name="gallery_id", referencedColumnName="id", onDelete="SET NULL")
     */
    protected $gallery;

    /**
     * @ORM\OneToMany(targetEntity="Reservacion", mappedBy="location", cascade={"persist", "remove"})
     */
    protected $reservaciones;


    public function __toString()
    {
        return $this->getNombre();
    }



    public function getPrecio()
    {
        return $this->getPrecioBase()->getPrecioActual();

    }



    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set nombre
     *
     * @param string $nombre
     * @return Location
     */
    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    
        return $this;
    }

    /**
     * Get nombre
     *
     * @return string 
     */
    public function getNombre()
    {
        return $this->nombre;
    }

    /**
     * Set direccion
     *
     * @param string $direccion
     * @return Location
     */
    public function setDireccion($direccion)
    {
        $this->direccion = $direccion;
    
        return $this;
    }

    /**
     * Get direccion
     *
     * @return string 
     */
    public function getDireccion()
    {
        return $this->direccion;
    }

    /**
     * Set capacidad
     *
     * @param integer $capacidad
     * @return Location
     */
    public function setCapacidad($capacidad)
    {
        $this->capacidad = $capacidad;
    
        return $this;
    }

    /**
     * Get capacidad
     *
     * @return integer 
     */
    public function getCapacidad()
    {
        return $this->capacidad;
    }

    /**
     * Set descripcion
     *
     * @param string $descripcion
     * @return Location
     */
    public function setDescripcion($descripcion)
    {
        $this->descripcion = $descripcion;
    
        return $this;
    }

    /**
     * Get descripcion
     *
     * @return string 
     */
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    /**
     * Set slug
     *
     * @param string $slug
     * @return Location
     */
    public function setSlug($slug)
    {
        $this->slug = $slug;
    
        return $this;
    }

    /**
     * Get slug
     *
     * @return string 
     */
    public function getSlug()
    {
        return $this->slug;
    }

    /**
     * Set precio_base
     *
     * @param \Gwada\GitesBundle\Entity\Tarifa $precioBase
     * @return Location
     */
    public function setPrecioBase(\Gwada\GitesBundle\Entity\Tarifa $precioBase = null)
    {
        $this->precio_base = $precioBase;
    
        return $this;
    }

    /**
     * Get precio_base
     *
     * @return \Gwada\GitesBundle\Entity\Tarifa 
     */
    public function getPrecioBase()
    {
        return $this->precio_base;
    }


    /**
     * Add reservaciones
     *
     * @param \Gwada\GitesBundle\Entity\Reservacion $reservaciones
     * @return Location
     */
    public function addReservacione(\Gwada\GitesBundle\Entity\Reservacion $reservaciones)
    {
        $this->reservaciones[] = $reservaciones;
    
        return $this;
    }

    /**
     * Remove reservaciones
     *
     * @param \Gwada\GitesBundle\Entity\Reservacion $reservaciones
     */
    public function removeReservacione(\Gwada\GitesBundle\Entity\Reservacion $reservaciones)
    {
        $this->reservaciones->removeElement($reservaciones);
    }

    /**
     * Get reservaciones
     *
     * @return \Doctrine\Common\Collections\Collection 
     */
    public function getReservaciones()
    {
        return $this->reservaciones;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->reservaciones = new \Doctrine\Common\Collections\ArrayCollection();
    }
    
    /**
     * Set gallery
     *
     * @param \Application\Sonata\MediaBundle\Entity\Gallery $gallery
     * @return Location
     */
    public function setGallery(\Application\Sonata\MediaBundle\Entity\Gallery $gallery = null)
    {
        $this->gallery = $gallery;
    
        return $this;
    }

    /**
     * Get gallery
     *
     * @return \Application\Sonata\MediaBundle\Entity\Gallery 
     */
    public function getGallery()
    {
        return $this->gallery;
    }
}