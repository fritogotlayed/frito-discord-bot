# TODO: Use context specific to this function
# data "template_file" "associate_user_context" {
#   template = file("${path.module}/templates/associate-user-context.json")
#   vars = {
#     mongo_conn_string = "mongodb://${var.mongo_user}:${var.mongo_pass}@192.168.1.160:27017"
#     steam_api_key     = var.steam_api_key
#   }
# }

resource "mdscloud_function" "collectGames" {
  name             = "collectGames"
  file_name        = "app.zip"
  runtime          = "node"
  entry_point      = "collectGames:main"
  source_code_hash = filebase64sha256("app.zip")
  context          = data.template_file.associate_user_context.rendered
}
