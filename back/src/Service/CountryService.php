<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\{Country};
use App\Repository\CountryRepository;
use Doctrine\ORM\{EntityManagerInterface};

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

    /**
     * @return array
     */
    public function getAll(): array
    {
        return $this->repo->findAll();
    }

    /**
     * @param int $id
     * @return Country
     */
    public function getById(int $id): Country
    {
        $entity = $this->repo->find($id);

        return $entity;
    }
}
