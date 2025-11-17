# HTTP → MQTT forwarder API documentation

This API allows developers to control a lamp over HTTP.  
All requests must be sent using simple GET requests.  
Responses are JSON and include proper HTTP codes.

Base URL example:
http://your-server-ip:8080

---

## 1. Turn lamp ON
### Endpoint
GET /lamp/on

### MQTT Action
Publishes "1" to topic: lampur/001/on

### Example Response
HTTP 200
{
  "success": true,
  "message": "Lamp turned on"
}

### Example Request (curl)
curl http://your-server-ip:8080/lamp/on

---

## 2. Turn lamp OFF
### Endpoint
GET /lamp/off

### MQTT Action
Publishes "1" to topic: lampur/001/off

### Example Response
HTTP 200
{
  "success": true,
  "message": "Lamp turned off"
}

### Example Request
curl http://your-server-ip:8080/lamp/off

---

## 3. Set brightness (1–100)
### Endpoint
GET /lamp?brightness=<value>

### Query Parameter
- brightness: number from 1 to 100
- If the value is outside this range, it is automatically clamped:
  - below 1 → becomes 1
  - above 100 → becomes 100

### MQTT Action
Publishes the brightness raw number to topic: lampur/001/brightness

### Example Request
curl "http://your-server-ip:8080/lamp?brightness=55"

### Example Success Response
HTTP 200
{
  "success": true,
  "message": "Brightness set to 55"
}

### Example Error Response (missing parameter)
HTTP 400
{
  "success": false,
  "error": "Brightness query parameter is required: /lamp?brightness=1-100"
}

### Example Error Response (invalid)
HTTP 400
{
  "success": false,
  "error": "Brightness must be a number"
}

---

## Notes for developers

- All endpoints use GET.
- All responses are JSON.
- Ensure your integration sends simple GET requests.
- Brightness is strictly numeric and will auto-correct out-of-range values.
- No authentication is needed.

This API is designed to be extremely lightweight and fast for IoT usage.
