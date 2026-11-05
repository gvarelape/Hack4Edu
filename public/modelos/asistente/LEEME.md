# Modelo del asistente (nivel 2)

- `e5/`: `multilingual-e5-small` de Hugging Face (`Xenova/multilingual-e5-small`), cuantizado `int8`. Licencia MIT. Con el vocabulario recortado a español, inglés y francés para que pese menos.
- `wasm/`: motor de ONNX Runtime Web (`onnxruntime-web`, licencia MIT).
- `embeddings.json`: los vectores de las preguntas del banco. Se genera con `npm run embeddings`.
