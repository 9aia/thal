import { isSubscriptionStatusModalOpen } from '~/store'

export function toastPaymentRequiredOptions(data: ToastMoreOptions) {
  return {
    meta: {
      disableReport: true,
      ...data.meta,
    },
    actions: [
      {
        title: 'Manage subscription',
        onClick: () => isSubscriptionStatusModalOpen.value = true,
      },
      ...(data.actions || []),
    ],
    ...data,
  }
}
