<?php

namespace Pexipay\Exceptions;

class PexipayException extends \Exception
{
    private ?string $code;
    private ?string $requestId;
    private $details;

    public function __construct(
        string $message,
        int $statusCode = 0,
        ?string $code = null,
        ?string $requestId = null,
        $details = null
    ) {
        parent::__construct($message, $statusCode);
        $this->code = $code;
        $this->requestId = $requestId;
        $this->details = $details;
    }

    public function getErrorCode(): ?string
    {
        return $this->code;
    }

    public function getRequestId(): ?string
    {
        return $this->requestId;
    }

    public function getDetails()
    {
        return $this->details;
    }

    public function getStatusCode(): int
    {
        return $this->getCode();
    }
}
