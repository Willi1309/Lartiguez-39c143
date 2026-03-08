ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

trap "kill 0" EXIT

echo "🚀 Iniciando aplicación en: $ROOT_DIR"

echo "📦 Iniciando Backend en puerto 3000..."
(
  cd "$ROOT_DIR/backend" || exit
  npm install
  npm run start:dev
) & 
BACKEND_PID=$!

sleep 5

echo "💻 Iniciando Frontend en puerto 5173..."
(
  cd "$ROOT_DIR/frontend" || exit
  npm install
  npm run dev
) &
FRONTEND_PID=$!

echo -e "\n-----------------------------------------------------------"
echo -e "✅ Servicios iniciados correctamente."
echo -e "🔗 La aplicación está disponible en: ${GREEN}http://localhost:5173/${NC}"
echo -e "🛑 Presiona Ctrl+C para detener ambos servicios."
echo -e "-----------------------------------------------------------\n"

wait