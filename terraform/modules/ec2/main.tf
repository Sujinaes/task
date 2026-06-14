resource "aws_instance" "this" {
  ami           = var.ami
  instance_type = "t3.micro"

  key_name = var.key_name

  vpc_security_group_ids = [var.security_group]

  user_data = file(var.user_data)

  tags = {
    Name = "terraform-test-ec2"
  } 
}