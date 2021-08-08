
# CodeFactor

![image](https://user-images.githubusercontent.com/29376434/128626456-e7f367c7-0825-4eb3-a021-130960f6f6dc.png)

He tenido que incorporar muchos archivos de la API de TomTom. Modificando varios de ellos con Typescript, etc. pero es código JS y aparecen multitud de issues que han bajado el rating a nivel C.

También hay varios issues de complejidad, pero no he podido hacer gran cosa, tenía que adaptarme a los archivos que disponía.

# Funcionamiento

El funcionamiento es muy intuitivo. Primero Geolocaliza el dispositivo. Si no tengo los permisos necesarios se muestra un mensaje.

He creado un marcador azul en el mapa que será el origen de todas las búsquedas. Este marcador se puede arrastrar y si no lo vemos en pantalla he creado un botón en el mapa que lo moverá hasta el centro de la vista actual. 

He añadido dos sliders para seleccionar el rádio de las distintas búsquedas: Uno mas preciso de 100 a 999 metros y otro más general que va desde un kilómetro hasta 10 kilómetros.

La búsqueda con autocomplete se hace filtrando bares, restaurantes y parkes. Los distintos lugares aparecen agrupados por tipo de POI.

Una vez seleccionado un lugar no hace falta pulsar el botón de búsqueda, aparece directamente en el mapa junto con la ruta en coche y las instrucciones para el viaje.

Pulsando los botones oportunos se seleccionarán los lugares más cercanos de las distintas categorias, con un máximo de 100 POI localizados. Google Maps solo permite un máximo de 60.

En el mapa aparecerá resaltado el perímetro buscado.

Aparecerán en pantalla mensajes con los sitios encontrados, errores, etc.

 
# La idea

He utilizado la API de TomTom para mi projecto, experimentando así con una alternativa a Google Maps.
El acceso es libre, siempre que el uso no supere unas ciertas cuotas. No es necesaria una Tarjeta de Crédito ni te piden datos irrelevantes como el número de teléfono. (Life after Google).

# Deploy

He utilizado Netlify para el deploy:

[https://610f85ee14cf621af7b6b2cf--naughty-spence-7be08c.netlify.app/](https://610f85ee14cf621af7b6b2cf--naughty-spence-7be08c.netlify.app/)

# Tecnología

He utilizádo las siguientes versiones:

React 16.11.0
Typescript 4.1.2
Controles y theming con Material UI 4.12.3
Material UI Lab 4.0.0-alpha.60
TomTom API V6
react-moment 1.1.1
axios 0.21.1
Turf 6.5.0

    
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
