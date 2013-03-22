<?php
/**
 * Created by JetBrains PhpStorm.
 * @author: Ibrael
 * Date: 8/03/13
 * Time: 23:10
 */

namespace Gwada\GitesBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use Gwada\GitesBundle\Entity\Location;
/**
 * @ORM\Entity(repositoryClass="Gwada\GitesBundle\Entity\ReservacionRepository")
 */
class Reservacion
{

    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=100)
     * @ORM\GeneratedValue
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     * @Assert\Email()
     */
    protected $email;

    /** @ORM\Column(type="string", length=100, nullable=true) */
    protected $telefono;

    /**
     * @ORM\Column(type="string", length=100)
     * @Assert\NotBlank()
     */
    protected $nombre;

    /**
     * @ORM\Column(type="date")
     *
     */
    protected $fecha_entrada;

    /** @ORM\Column(type="date") */
    protected $fecha_publicacion;

    /** @ORM\Column(type="date") */
    protected $fecha_salida;

    /**
     * @ORM\Column(type="integer")
     */
    protected $capacidad;

    /** @ORM\ManyToOne(targetEntity="Location", inversedBy="reservaciones") */
    protected $location;

    /** @ORM\Column(type="boolean") */
    protected $confirmada;

    /** @ORM\Column(type="boolean") */
    protected $atendida;


    /**
     * @return bool
     * @Assert\True(message="La date d' arrivée doit être avant que la date de sortie")
     */
    public function isValidDateRange()
    {
        return $this->getFechaSalida() > $this->getFechaEntrada();
    }

    /**
     * @return bool
     * @Assert\True(message="La capacité doit être egal ou mineur qui la capacité de la location")
     */
    public function isValidCapacidad()
    {
        return $this->getCapacidad() <= $this->getLocation()->getCapacidad();
    }



    public function __construct()
    {
        $this->confirmada = false;
        $this->atendida = false;
        $this->fecha_publicacion = new \DateTime("now");
    }


    public function getGanancia()
    {
        return ceil($this->getDias() / 7) * $this->getLocation()->getPrecio();
    }

    public function getDias()
    {
        $interval = $this->getFechaSalida()->diff($this->getFechaEntrada());

        return $interval->days;
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
     * Set email
     *
     * @param string $email
     * @return Reservacion
     */
    public function setEmail($email)
    {
        $this->email = $email;
    
        return $this;
    }

    /**
     * Get email
     *
     * @return string 
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set telefono
     *
     * @param string $telefono
     * @return Reservacion
     */
    public function setTelefono($telefono)
    {
        $this->telefono = $telefono;
    
        return $this;
    }

    /**
     * Get telefono
     *
     * @return string 
     */
    public function getTelefono()
    {
        return $this->telefono;
    }

    /**
     * Set nombre
     *
     * @param string $nombre
     * @return Reservacion
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
     * Set fecha_publicacion
     *
     * @param \DateTime $fechaPublicacion
     * @return Reservacion
     */
    public function setFechaPublicacion($fechaPublicacion)
    {
        $this->fecha_publicacion = $fechaPublicacion;
    
        return $this;
    }

    /**
     * Get fecha_publicacion
     *
     * @return \DateTime 
     */
    public function getFechaPublicacion()
    {
        return $this->fecha_publicacion;
    }

    /**
     * Set capacidad
     *
     * @param integer $capacidad
     * @return Reservacion
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
     * Set confirmada
     *
     * @param boolean $confirmada
     * @return Reservacion
     */
    public function setConfirmada($confirmada)
    {
        $this->confirmada = $confirmada;
    
        return $this;
    }

    /**
     * Get confirmada
     *
     * @return boolean 
     */
    public function getConfirmada()
    {
        return $this->confirmada;
    }

    /**
     * Set atendida
     *
     * @param boolean $atendida
     * @return Reservacion
     */
    public function setAtendida($atendida)
    {
        $this->atendida = $atendida;
    
        return $this;
    }

    /**
     * Get atendida
     *
     * @return boolean 
     */
    public function getAtendida()
    {
        return $this->atendida;
    }

    /**
     * Set location
     *
     * @param \Gites\LocationBundle\Entity\Location $location
     * @return Reservacion
     */
    public function setLocation(Location $location = null)
    {
        $this->location = $location;
    
        return $this;
    }

    /**
     * Get location
     *
     * @return \Gites\LocationBundle\Entity\Location 
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * Set fecha_entrada
     *
     * @param \DateTime $fechaEntrada
     * @return Reservacion
     */
    public function setFechaEntrada($fechaEntrada)
    {
        $this->fecha_entrada = $fechaEntrada;
    
        return $this;
    }

    /**
     * Get fecha_entrada
     *
     * @return \DateTime 
     */
    public function getFechaEntrada()
    {
        return $this->fecha_entrada;
    }

    /**
     * Set fecha_salida
     *
     * @param \DateTime $fechaSalida
     * @return Reservacion
     */
    public function setFechaSalida($fechaSalida)
    {
        $this->fecha_salida = $fechaSalida;
    
        return $this;
    }

    /**
     * Get fecha_salida
     *
     * @return \DateTime 
     */
    public function getFechaSalida()
    {
        return $this->fecha_salida;
    }
}