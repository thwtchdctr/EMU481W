const LoginPage = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Enter your password"
              />
            </div>
            <div className="text-right">
              <button className="button">Log In</button>
            </div>
          </form>
          <p className="mt-4 text-center">
            Don't have an account? <a href="/signup" className="text-green-500">Sign Up</a>
          </p>
        </div>
      </div>
    );
  };
  
  export default LoginPage;
  
  
  