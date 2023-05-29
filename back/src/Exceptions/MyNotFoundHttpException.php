<?php

namespace App\Exceptions;

use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MyNotFoundHttpException extends NotFoundHttpException
{
    private array $extraData = [];

    public function __construct($message, $extra = [])
    {
        parent::__construct($message);
        $this->extraData = $extra;
    }

    public function getExtra()
    {
        return $this->extraData;
    }
}
