export const handler = async (event) => {
    console.log("Event = " + JSON.stringify(event));    

const pathSegments = event.requestContext.http.path.split('/');

const contextPath = pathSegments.length > 1 ? pathSegments[1] : '';
const action = pathSegments[pathSegments.length - 1];

switch (action) {
  case 'ok':
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'OK', contextPath: contextPath }),
    };
  case 'error':
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', contextPath: contextPath }),
    };
  case 'bad':
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Bad Request', contextPath: contextPath }),
    };
  default:
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not Found', contextPath: contextPath }),
    };
}

}
