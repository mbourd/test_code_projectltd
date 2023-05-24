<?php

namespace App\Service;

use App\Entity\{Player};
use App\Repository\PlayerRepository;
use Doctrine\ORM\{EntityManagerInterface};

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

    /**
     * @param int $id
     * @return Player
     */
    public function getById(int $id): Player
    {
        $entity = $this->repo->find($id);

        return $entity;
    }

    public function save(Player $player): Player
    {
        $this->repo->save($player, true);
        return $player;
    }
}
