Universidad Nacional de Costa Rica  <br />
Escuela de Informática  <br />
Ingeniería en Sistemas  <br />
Curso: Paradigmas de Programación  <br />
Profesor: Carlos Loría Sáenz  <br />
Ciclo II - 2023  <br />

Proyecto OneFlowStream (OFS)  <br />
    Aplicacion enfocada en la transpilacion de codigo OSF a JS, utilizando como compilador un servidor de Prolog. <br />
    Una vez transpilado el código se puede evaluar la transpilación mostrando en pantalla el resultado de la misma.

Desarrolladores: <br />
    - Kenneth Alfaro Barboza <br />
    - Luis Fuentes Fuentes <br />
    - Luis Eduardo Restrepo Veintemilla <br />
    - Maria Angelica Robles Azofeifa <br />
    - Royer Zuñiga Villareal <br />

Pasos para la ejecución la aplicación:

1. Clonar la rama principal ("Master") y descargar el código por medio del comando:  <br />

	- git clone https://github.com/L4F7/one-flow-stream.git

2. Abrir una terminal y navegar a la carpeta donde se descargó en el proyecto.


3. Instalar las dependencias necesarias: <br />
          - npm install

4. Crear el Build de la aplicación con el siguiente comando: <br />
          - npm run build

5. Iniciar la aplicación con este comando: <br />
         - npm start

6. Dentro de la carpeta del proyecto abrimos una consola e ingresamos el siguiente <br />
   comando para iniciar el servidor de Prolog:  <br />
	 - swipl simple_service_server.pl
    
8. Abrir el navegador web y acceder a: http://localhost:3000/

De manera opcional para la ejecución de la aplicación, esta cuenta con un archivo .bat el cual se encarga  <br />
de ejecutar npm install, npm build, npm start e inicializar el servidor de prolog de manera automática. Para  <br />
la ejecución del mismo solo es necesario navegar a la carpeta donde se descargó el proyecto y ejecutar el <br />
archivo Run-Install-Build-Start.bat.
