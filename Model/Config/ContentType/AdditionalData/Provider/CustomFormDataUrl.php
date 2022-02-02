<?php

declare(strict_types=1);

namespace HappyMachines\CustomFormsPageBuilder\Model\Config\ContentType\AdditionalData\Provider;

use Magento\Framework\UrlInterface;
use Magento\PageBuilder\Model\Config\ContentType\AdditionalData\ProviderInterface;

/**
 * Provides URL for retrieving custom form metadata
 */
class CustomFormDataUrl implements ProviderInterface
{
    /**
     * @var UrlInterface
     */
    private $urlBuilder;

    /**
     * CustomFormDataUrl constructor.
     * @param UrlInterface $urlBuilder
     */
    public function __construct(UrlInterface $urlBuilder)
    {
        $this->urlBuilder = $urlBuilder;
    }

    /**
     * @inheritdoc
     */
    public function getData(string $itemName) : array
    {
        return [$itemName => $this->urlBuilder->getUrl('pagebuilder/contenttype_customform/metadata')];
    }
}
