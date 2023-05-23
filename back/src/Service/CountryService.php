<?php

namespace App\Service;

use App\Entity\{Team, Country, Player};
use App\Repository\CountryRepository;
use Doctrine\ORM\{EntityManagerInterface, EntityNotFoundException};

class CountryService
{
    /** @var EntityManagerInterface */
    protected $manager;

    /** @var CountryRepository */
    protected $repo;

    /**
     * CountryService constructor.
     * @param EntityManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
        $this->repo = $this->manager->getRepository(Country::class);
    }

    public function getAll(): array
    {
        return $this->repo->findAll();
    }

    /**
     * @throws EntityNotFoundException
     * @param int $id
     * @return Country
     */
    public function getById(int $id): Country
    {
        $entity = $this->repo->find($id);

        if (is_null($entity)) {
            throw new EntityNotFoundException("Country id $id not found");
        }

        return $entity;
    }
}
