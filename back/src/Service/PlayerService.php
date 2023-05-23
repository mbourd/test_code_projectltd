<?php

namespace App\Service;

use App\Entity\{Team, Country, Player};
use App\Repository\PlayerRepository;
use Doctrine\ORM\{EntityManagerInterface, EntityNotFoundException};

class PlayerService
{
    /** @var EntityManagerInterface */
    protected $manager;

    /** @var PlayerRepository */
    protected $repo;

    /**
     * PlayerService constructor.
     * @param EntityManagerInterface $manager
     */
    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
        $this->repo = $this->manager->getRepository(Player::class);
    }
}
