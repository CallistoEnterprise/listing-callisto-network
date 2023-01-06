import { useToast } from 'vue-toastification'
import type { ToastID, ToastOptions } from 'vue-toastification/dist/types/types'
import BaseNotification from '~/components/BaseNotification.vue'
import { getTxUrl } from '~/utils/utils'

export enum NotificationVariant {
  Success = 'success',
  Pending = 'pending',
  Warning = 'warning',
  Error = 'error',
}

export interface NotificationLink {
  label: string
  url: string
}

export interface NotificationProps {
  heading: string
  content?: string
  actions?: NotificationLink[]
  permanent?: boolean
  replaceID?: ToastID
}

export default function useNotifications() {
  const toast = useToast()

  const dismissNotification = (id: ToastID) => toast.dismiss(id)

  const notify = (props: NotificationProps, variant: NotificationVariant, options: ToastOptions) => {
    if (props.replaceID !== undefined) {
      toast.update(props.replaceID, {
        content: {
          component: BaseNotification,
          props: {
            heading: props.heading,
            content: props.content,
            actions: props.actions,
            permanent: props.permanent,
            variant,
          },
        },
        options: { toastClassName: 'custom-toast', ...options },
      })
      return props.replaceID
      // dismissNotification(props.replaceID)
    }

    return toast({
      component: BaseNotification,
      props: {
        heading: props.heading,
        content: props.content,
        actions: props.actions,
        permanent: props.permanent,
        variant,
      },
    }, { toastClassName: 'custom-toast', ...options })
  }

  const toastSuccess = (props: NotificationProps) => {
    return notify(props, NotificationVariant.Success, {})
  }

  const toastSuccessTx = (props: NotificationProps, txHash: string) => {
    props.actions = [
      {
        label: 'View in explorer',
        url: getTxUrl(txHash),
      },
    ]
    return notify(props, NotificationVariant.Success, {})
  }

  const toastPending = (props: NotificationProps) => {
    props.permanent = true
    return notify(props, NotificationVariant.Pending, {
      timeout: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    })
  }

  const toastWarning = (props: NotificationProps) => {
    return notify(props, NotificationVariant.Warning, {})
  }

  const toastError = (props: NotificationProps) => {
    return notify(props, NotificationVariant.Error, {})
  }

  return {
    toastSuccess,
    toastSuccessTx,
    toastPending,
    toastWarning,
    toastError,
    dismissNotification,
  }
}
