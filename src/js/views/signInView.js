import {
  elements
} from '../views/base';

export const renderSignInView = () => {
  const markup = `<div id="login">
      <h3 class="text-center text-white pt-5">Login form</h3>
      <div class="container">
        <div id="login-row" class="row justify-content-center align-items-center">
          <div id="login-column" class="col-md-6">
            <div class="login-box col-md-12">
              <form id="login-form" class="form" action="" method="post">
                <h3 class="text-center text-info">Login</h3>
                <div class="form-group">
                  <label for="username" class="text-info">Username:</label><br />
                  <input type="text" name="username" id="username" class="form-control" />
                </div>
                <div class="form-group">
                  <label for="password" class="text-info">Password:</label><br />
                  <input type="text" name="password" id="password" class="form-control" />
                </div>
                <div class="form-group">
                  <input type="submit" name="submit" id="signin" class="btn btn-info btn-md" value="submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  elements.app.innerHTML = markup;
};