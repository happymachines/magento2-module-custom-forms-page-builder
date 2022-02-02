<?php

declare(strict_types=1);

namespace HappyMachines\CustomFormsPageBuilder\Controller\Adminhtml\ContentType\CustomForm;

use HappyMachines\CustomForms\Api\Data\FormInterface;
use HappyMachines\CustomForms\Api\FormRepositoryInterface;
use Magento\Framework\App\ActionInterface;
use Magento\Framework\App\RequestInterface;
use Magento\Framework\Controller\ResultFactory;

/**
 * Class Metadata
 * @package HappyMachines\CustomFormsPageBuilder\Controller\Adminhtml\ContentType\Product
 */
class Metadata implements ActionInterface
{
    /**
     * {@inheritdoc}
     */
    const ADMIN_RESOURCE = 'Magento_Backend::admin';

    /**
     * @var RequestInterface
     */
    private $request;

    /**
     * @var ResultFactory
     */
    private $resultFactory;

    /**
     * @var FormRepositoryInterface
     */
    private $formRepository;

    /**
     * Metadata constructor.
     * @param RequestInterface $request
     * @param ResultFactory $resultFactory
     * @param FormRepositoryInterface $formRepository
     */
    public function __construct(
        RequestInterface $request,
        ResultFactory $resultFactory,
        FormRepositoryInterface $formRepository
    ) {
        $this->request = $request;
        $this->resultFactory = $resultFactory;
        $this->formRepository = $formRepository;
    }

    /**
     * @return \Magento\Framework\App\ResponseInterface|\Magento\Framework\Controller\ResultInterface
     */
    public function execute()
    {
        $params = $this->request->getParams();

        try {
            $formId = $params[FormInterface::FORM_ID];

            $form = $this->formRepository->getById($formId);
            $result = $form->getData();
        } catch (\Exception $e) {
            $result = [
                'error' => $e->getMessage(),
                'errorcode' => $e->getCode()
            ];
        }
        return $this->resultFactory->create(ResultFactory::TYPE_JSON)->setData($result);
    }
}
