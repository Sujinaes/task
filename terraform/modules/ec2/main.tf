resource "aws_instance" "this" {
  ami           = var.ami
  instance_type = "t3.micro"

  key_name = var.key_name

  vpc_security_group_ids = [var.security_group]

  user_data = file(var.user_data)

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = "terraform-test-ec2"
  }

  lifecycle {
    ignore_changes = [ami]
  }
}