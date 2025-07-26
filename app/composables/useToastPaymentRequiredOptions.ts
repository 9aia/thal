import { isSubscriptionStatusModalOpen } from '~/store'

function useToastPaymentRequiredOptions() {
  const { t } = useI18nExperimental()

  const toastPaymentRequiredOptions = (data: ToastMoreOptions = {}) => {
    return {
      meta: {
        disableReport: true,
        ...data.meta,
      },
      actions: [
        {
          title: t('Manage subscription'),
          onClick: () => isSubscriptionStatusModalOpen.value = true,
        },
        ...(data.actions || []),
      ],
      ...data,
    }
  }

  return toastPaymentRequiredOptions
}

export default useToastPaymentRequiredOptions
