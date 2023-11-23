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


Pasos para la instalación y ejecución la aplicación de manera totalmente automatizada:

1. Abrir el folder principal del proyecto.  <br />

2. Ejecutar el archivo BAT: Run-Install-Build-Start.bat.  <br />

3. La automatizacion se encargará de instalar las dependencias y crear el "Build" del proyecto; además de inicializar el servidor de Prolog de manera automática.  <br />

4. Cuando la instalación y build finalizan, el archivo BAT se encargará de ejecutar el proyecto.  <br />

5. Abrir el navegador web y acceder a: http://localhost:3000/  <br />

NOTA: 
 - En caso de presentarse algun problema en la ejecución del archivo BAT, se incluyen a continuación los pasos para realizar la instalación, build y ejecución de App y Servidor de manera manual.
 - Hacer caso omiso a las instrucciones abajo en caso de que el archivo BAT se haya ejecutado correctamente.

Pasos para la ejecución la aplicación de manera manual en caso de que alguno de las automatizaciones muestre un resultado fallido:

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
	 - swipl prolog/server.pl
    
8. Abrir el navegador web y acceder a: http://localhost:3000/