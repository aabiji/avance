import * as React from "react"
import Svg, { Path } from "react-native-svg"

export default function Logo() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1320 1000"
      style={{ width: 300, height: 200, marginTop: 50, alignSelf: "center" }}
    >
      <Path d="M0 0h1320v1000H0V0z" fill="#FEFEFE" />
      <Path
        d="M716.355 244.77c10.523 4.734 18.38 13.502 25.645 22.23 1.993 2.36 3.995 4.712 6 7.063l1.571 1.843c3.632 4.234 7.392 8.24 11.429 12.094a120.179 120.179 0 004.578-6.367c4.783-7.175 10.023-13.726 18.422-16.633 5.895-.91 10.622-.717 15.75 2.5 7.145 5.445 13.682 12.52 15.7 21.5.458 5.217-1.476 8.064-4.723 11.996L809 303c-3.997 4.888-6.7 8.764-8 15l-2.563-.438c-4.54.578-5.919 2.541-8.824 5.907C788 325 788 325 785 325c.025 7.482.506 12.305 5.512 17.98 2.253 3.058 2.927 6.352 3.75 10.016L795 355l3 1 .758-1.629c1.523-2.908 3.293-5.58 5.117-8.308l2.055-3.09C808 340 808 340 810.105 337.783c2.472-3.63 2.355-5.91 2.286-10.271l-.018-2.131a519.581 519.581 0 00-.123-6.693c-.02-1.52-.038-3.038-.055-4.557-.044-3.711-.113-7.42-.195-11.131h4l1 9c1.584-4.581 2.9-9.19 4.125-13.875l.55-2.086c.444-1.68.885-3.359 1.325-5.039h2c.248 6.57-.676 12.57-2 19h2l.332-2.055c.835-4.902 1.771-9.76 3.043-14.57l.648-2.477C830 289 830 289 832.102 288.227L834 288c.217 4.533-.436 7.878-2 12.125-1.35 3.682-2 5.896-2 9.875l9-17h2c-.575 4.786-1.982 8.538-4.063 12.875l-1.66 3.492L834 312c2.369-2.318 4.582-4.64 6.625-7.25L843 302h2c-.584 3.965-2.57 6.188-5.063 9.25-4.241 5.38-7.318 11.025-10.197 17.23-1.41 3.01-2.661 5.425-4.806 8-2.462 3.208-3.41 6.584-4.559 10.395-4.385 13.39-13.67 27.856-24.375 37.125-3.594.547-5.364.403-8.453-1.555-3.16-3.033-4.629-6.064-6.422-10.007-2.367-4.988-4.805-9.707-7.875-14.313-3.237-4.897-7.25-11.06-7.25-17.125l-2.125 1.172L761 343.75l-2.813 1.547L755 347l-1.81.97c-5.22 2.713-10.564 4.707-16.128 6.592l-2.552.881c-1.685.58-3.372 1.156-5.06 1.727a587.33 587.33 0 00-4.732 1.624c-6.33 2.177-12.75 3.76-19.257 5.311A171.687 171.687 0 00689 369c1.974 5.058 4.672 7.636 8.724 11.006 7.097 6.217 11.882 13.212 16.151 21.557 4.03 7.644 8.225 15.078 12.916 22.338 4.836 7.509 9.47 15.854 8.209 25.099-7.595 9.942-27.862 12.96-39.644 14.639-9.012.97-18.104 1.284-27.16 1.59-14.773.327-14.773.327-28.196 5.771-3.707 10.537-2.64 19.88 1.809 29.992 1.214 3.065 1.934 5.722 2.191 9.008-2 2-2 2-4.75 2.438-4.276-.576-6.498-2.274-9.25-5.438-3.167-4.454-5.647-9.293-8.133-14.148-5.245-10.4-5.245-10.4-12.555-19.407-2.499-2.752-2.523-5.835-2.625-9.382l-.113-2.59C607 459 607 459 608.496 456.719c3.504-2.406 6.774-2.266 10.879-2.281 11.997-.361 22.958-3.111 34.434-6.547 2.704-.755 5.3-1.267 8.066-1.703 4.463-.914 6.856-3.345 10.078-6.438 4.288-3.666 9.606-5.5 15.047-6.75l-2.055-1.25c-8.38-5.2-16.146-10.756-23.008-17.875-4.49-4.58-9.358-9.428-15.937-10.25-3.713 1.702-6.098 4.013-9.063 6.797-16.072 14.106-36.392 27.82-57.058 33.937-3.217 1.097-5.96 2.911-8.879 4.641l-3.438 1.313c-3.74 1.772-6.262 3.795-9.277 6.578L556 459l-1.638 1.586c-5.373 5.002-11.11 8.14-17.675 11.352-8.142 4.122-15.686 8.154-22.687 14.062l-2.621 2.172c-8.068 6.953-14.956 13.405-15.836 24.348a999.273 999.273 0 00-.356 5.293l-.232 2.658c-.39 6.27.658 9.287 4.045 14.529v4c-3.365 2.014-6.103 2.355-10 2.438l-3.125.12C483 541 483 541 480.73 538.849c-6.482-10.667-5.439-25.756-5.73-37.848-.04-1.24-.04-1.24-.083-2.505a489.52 489.52 0 01-.167-6.932l-.078-3.997c.36-3.905 1.245-6.262 3.328-9.566 3.592-2.395 5.302-2.194 9.562-2.25 13.354-.915 20.344-9.07 28.883-18.559 3.916-4.499 7.223-9.241 10.332-14.324 6.65-8.577 16.154-11.457 26.024-15.078 14.015-5.321 23.378-14.94 32.586-26.535 3.668-4.552 7.89-8.064 12.449-11.707 3.657-2.923 7.227-5.947 10.789-8.984l1.867-1.577c3.198-2.623 3.198-2.623 5.508-5.986l.219-3.125c.625-8.62 1.878-13.626 8.351-19.852 6.638-5.527 12.793-8.745 21.578-9.113 11.653-.526 20.78-9.201 29.477-16.215 3.769-3.035 7.675-5.857 11.613-8.668 2.52-1.85 4.958-3.78 7.395-5.738C712.557 296 712.557 296 720 296c2.252-4.372 2.206-7.255 1-12-1.136-1.968-2.382-3.823-3.664-5.698-1.445-2.489-2.22-4.799-3-7.564l-.772-2.698L713 266c-5.266.188-10.531.4-15.796.635-1.788.076-3.576.146-5.365.209-2.583.092-5.164.208-7.745.328l-2.394.07c-6.732.352-12.024 2.391-17.098 6.88l-1.977 2.316-2.246 2.613a319.938 319.938 0 00-9.105 11.834c-1.046 1.406-2.155 2.766-3.274 4.115h-2c-.349-4.898.532-7.659 3-11.875l1.687-2.93L652 278c-5.007 1.344-8.584 3.66-12.563 6.875l-1.67 1.316a355.163 355.163 0 00-7.544 6.13C628 294 628 294 626 294c1.096-7.399 7.941-11.48 13.441-15.719 2.537-2.262 3.994-4.288 5.559-7.281-2.17 1.201-4.337 2.409-6.5 3.625l-1.939 1.09c-4.289 2.45-8.178 5.099-11.913 8.351-1.648.934-1.648.934-3.859.586L619 284c1.385-3.326 2.769-4.825 5.809-6.727l2.263-1.437 2.365-1.461 2.354-1.484c1.444-.91 2.89-1.817 4.34-2.718A211.43 211.43 0 00641 267c-5.189.463-9.355 1.411-14.168 3.367-2.332.806-4.388.862-6.832.633l1-3c2.504-1.168 2.504-1.168 5.563-2.187 1.011-.345 2.023-.689 3.066-1.043L632 264l-8-1v-3l3.038-.152c3.771-.19 7.541-.39 11.311-.593 1.623-.085 3.245-.169 4.868-.25 11.868-.592 23.108-1.61 34.47-5.317l4.09-1.32 2.09-.681a471.504 471.504 0 016.574-2.054l2.187-.67c1.38-.424 2.762-.844 4.144-1.263 2.58-.797 5.038-1.604 7.455-2.817 3.977-1.98 8.058-1.443 12.128-.113z"
        fill="#1399CD"
      />
      <Path
        d="M690 604h36c8.378 9.285 8.378 9.285 9.855 13.602 2.044 5.36 4.784 9.828 7.957 14.586a964.413 964.413 0 013 4.75l1.56 2.472c2.989 4.754 5.965 9.515 8.94 14.278l1.901 3.041c3.233 5.177 6.463 10.356 9.69 15.537l1.953 3.134a5122.4 5122.4 0 013.606 5.792c5.41 8.674 10.981 17.22 16.538 25.808l1-103h31v149h-36c-4.43-6.329-8.614-12.497-12.5-19.125a1045.014 1045.014 0 00-13.75-22.5 3012.005 3012.005 0 01-17.505-28.24C736.237 671.708 729.105 660.367 722 649l-1 104h-31V604z"
        fill="#010101"
      />
      <Path
        d="M572.602 603.886a782 782 0 014.808.016l2.552.005c2.7.005 5.4.018 8.1.03A6387.782 6387.782 0 01607 604c3.39 7.97 6.55 15.994 9.52 24.129l1.26 3.43 2.658 7.249c2.107 5.756 4.222 11.51 6.337 17.263l2.14 5.823a7737.676 7737.676 0 0012.585 33.981 1315560.837 1315560.837 0 015.657 15.179c2.808 7.535 5.611 15.072 8.412 22.61a25113.864 25113.864 0 004.052 10.898l1.326 3.567A208.95 208.95 0 01663 754h-33l-5-14.375-1.582-4.533-1.23-3.553c-.42-1.204-.838-2.409-1.27-3.65C620 725 620 725 620 723h-64l-3 11a173.062 173.062 0 01-1.824 5.45l-.839 2.377-1.024 2.86L546 754h-33l4.313-12 1.34-3.734 1.085-3.016 1.095-3.047c1.086-2.98 2.196-5.95 3.312-8.919 1.747-4.667 3.46-9.346 5.18-14.022l2.595-7.053 1.369-3.72a16334.92 16334.92 0 0121.649-58.552l.97-2.605c1.477-3.968 2.957-7.936 4.44-11.903 1.134-3.038 2.263-6.078 3.387-9.12l1.644-4.43.76-2.067c2.154-5.79 2.154-5.79 6.463-5.926z"
        fill="#030303"
      />
      <Path
        d="M253 604h39l4.363 11.988c9.534 26.178 19.087 52.347 28.825 78.45l1.175 3.153a6394.922 6394.922 0 0011.48 30.57c.579 1.528 1.157 3.057 1.734 4.585a2156.47 2156.47 0 003.125 8.213l1.341 3.541 1.157 3.031C346 750 346 750 346 753h-32l-5-13.875-1.582-4.375-1.23-3.43c-.42-1.162-.838-2.325-1.27-3.523C304 725 304 725 304 723h-64l-2 9a122.034 122.034 0 01-1.945 5.691l-.97 2.64-1.21 3.231L230 754h-32c2.024-7.421 4.14-14.463 6.852-21.613l1.124-3.004c1.212-3.233 2.43-6.464 3.649-9.696 1.29-3.438 2.579-6.877 3.867-10.316l2.636-7.031a5725.603 5725.603 0 0011.577-31.192 9433.713 9433.713 0 0118.783-50.538l2.73-7.282.816-2.177c1.85-4.92 1.85-4.92 2.966-7.151zM982.527 616.719c2.993 2.61 5.749 5.392 8.473 8.281l1.89 1.977c5.378 5.947 9.312 12.178 11.11 20.023-5.673 2.634-11.426 5.035-17.25 7.313l-2.076.844c-2.88 1.106-5.377 1.838-8.47 1.886-3.25-1.539-3.767-3.817-5.204-7.043-8.154-10.695-16.813-16.26-30-19-13.207-1.316-25.253 1.052-36 9-9.83 8.18-14.535 18.438-16 31-.351 8.156-.69 16.2 2 24l.777 2.344c4.363 12.132 11.315 20.33 22.934 25.972 11.78 4.632 26.534 4.324 38.289-.316 9.594-5.097 17.51-13.076 22-23 6.074.683 11.601 2.81 17.313 4.875l3.072 1.066 2.916 1.051 2.661.949C1003 709 1003 709 1004 712c-2.509 7.239-7.17 13.175-12 19-.425.594-.85 1.189-1.29 1.8-8.655 11.552-26.087 19.26-39.85 21.814-22.345 3.015-45.825.915-64.36-12.802-16.404-13.413-26.568-30.6-29.5-51.812-1.747-21.23 1.348-43.285 14.816-60.445 26.132-30.573 77.914-39.485 110.711-12.836z"
        fill="#020202"
      />
      <Path d="M1035 604h87v27h-56v34h50v27h-50v34h56v27h-87V604z" />
      <Path
        d="M358 604h33c6.3 17.387 12.43 34.823 18.438 52.313 6.42 18.716 6.42 18.716 13.015 37.37l.74 2.056c1.063 2.95 2.135 5.894 3.217 8.836l1.07 2.94.904 2.447C429 712 429 712 429 715h2l.326-1.973c.874-3.924 2.152-7.653 3.455-11.453l.865-2.544c.948-2.782 1.9-5.562 2.854-8.342l.99-2.9c9.579-28.02 19.55-55.901 29.51-83.788h33c-1.937 6.458-3.917 12.742-6.273 19.035l-.958 2.58c-.685 1.847-1.372 3.694-2.06 5.54-1.502 4.028-2.997 8.06-4.492 12.09l-2.414 6.502c-4.424 11.914-8.813 23.842-13.202 35.769-3.471 9.432-6.948 18.862-10.424 28.292-1.12 3.036-2.238 6.072-3.357 9.109-1.574 4.271-3.15 8.542-4.73 12.811-.555 1.5-1.109 3.001-1.661 4.502-.74 2.008-1.482 4.014-2.226 6.02l-1.23 3.328C448 752 448 752 447 753c-2.594.089-5.16.115-7.754.098l-2.35-.005c-2.486-.005-4.972-.018-7.459-.03-1.681-.006-3.363-.01-5.044-.014-4.131-.011-8.262-.028-12.393-.049l-1.338-3.711c-8.526-23.636-17.093-47.256-25.8-70.825l-.823-2.226-.799-2.162a3521.68 3521.68 0 01-7.846-21.488l-.843-2.33-.698-1.933a815.485 815.485 0 00-2.268-6.093 1353.708 1353.708 0 01-4.503-12.197l-.794-2.178-1.641-4.505-1.685-4.617c-.816-2.233-1.63-4.466-2.442-6.7-.254-.691-.507-1.383-.767-2.096C358 605.114 358 605.114 358 604z"
        fill="#010101"
      />
      <Path
        d="M272 633c2.173 3.26 3.271 6.473 4.46 10.16l.703 2.135c.742 2.254 1.478 4.51 2.212 6.768 4.048 12.548 4.048 12.548 8.795 24.844 1.228 3.096 2.129 6.27 3.021 9.476 1.11 3.592 2.489 7.097 3.809 10.617h-45c2.25-10.126 2.25-10.126 3.632-13.994l.931-2.63.992-2.747 1.039-2.916c.722-2.024 1.446-4.047 2.173-6.069 1.103-3.067 2.198-6.138 3.292-9.208a13495.593 13495.593 0 013.1-8.673c2.15-5.975 4.445-11.882 6.841-17.763z"
        fill="#F7F7F7"
      />
      <Path
        d="M587 634h2c2.024 5.728 4.045 11.457 6.063 17.188l.9 2.557c3.77 10.711 7.504 21.43 11.031 32.224A181.436 181.436 0 00611 697h-45c1.212-5.454 2.187-9.835 4.168-14.865 1.668-4.28 3.12-8.64 4.625-12.979l1.063-3.06c1.112-3.198 2.222-6.397 3.332-9.596l2.271-6.54c1.848-5.319 3.695-10.64 5.541-15.96z"
        fill="#F8F8F8"
      />
      <Path d="M826 302l-1 8h-2v-7c2-1 2-1 3-1z" fill="#D8EEF6" />
      <Path
        d="M843 302h2c-.188 1.875-.188 1.875-1 4-2.563 1.25-2.563 1.25-5 2 1.152-2.468 2.048-4.048 4-6z"
        fill="#3EACD6"
      />
    </Svg>
  )
}