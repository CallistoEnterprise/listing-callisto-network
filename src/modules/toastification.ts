import 'vue-toastification/dist/index.css'
import type { PluginOptions } from 'vue-toastification'
import Toast, { POSITION } from 'vue-toastification'
import type { UserModule } from '~/types'

const options: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  icon: false,

  timeout: 10000,
  // hideProgressBar: true,
  newestOnTop: false,
  // icon: false,
  // closeOnClick: false,
  transition: {
    enter: 'animate__animated animate__bounceIn',
    leave: 'animate__animated animate__fadeOut',
    move: 'fade-move',
  },

}

export const install: UserModule = ({ app, router }) => {
  options.onMounted = (_, toastApp) => {
    // Register the router. See here https://github.com/Maronato/vue-toastification/issues/162#issuecomment-945208145
    toastApp.use(router)
  }

  app.use(Toast, options)
}
