data "template_file" "associate_user_context" {
  template = file("${path.module}/templates/associate-user-context.json")
  vars = {
    mongo_conn_string = "mongodb://${var.mongo_user}:${var.mongo_pass}@192.168.5.108:27017"
    steam_api_key     = var.steam_api_key
  }
}

resource "mdscloud_function" "associateUser" {
  name             = "associateUser"
  file_name        = "app.zip"
  runtime          = "node"
  entry_point      = "associateUser:main"
  source_code_hash = filebase64sha256("app.zip")
  context          = data.template_file.associate_user_context.rendered
}
