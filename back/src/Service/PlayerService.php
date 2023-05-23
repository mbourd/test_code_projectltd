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

    /**
     * @throws EntityNotFoundException
     * @param int $id
     * @return Player
     */
    public function getById(int $id): Player
    {
        $entity = $this->repo->find($id);

        if (is_null($entity)) {
            throw new EntityNotFoundException("Player id $id not found");
        }

        return $entity;
    }

    public function save(Player $player): Player
    {
        $this->repo->save($player, true);
        return $player;
    }
}
