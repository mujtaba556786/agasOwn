# Generated by Django 3.0.5 on 2021-10-18 11:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Categories',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('category_name', models.CharField(blank=True, max_length=100, null=True)),
                ('category_name_de', models.CharField(blank=True, max_length=100, null=True)),
                ('picture', models.ImageField(blank=True, null=True, upload_to='images')),
                ('active', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='odata.Categories')),
            ],
            options={
                'db_table': 'odata_category',
            },
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(blank=True, max_length=100, null=True)),
                ('last_name', models.CharField(blank=True, max_length=100, null=True)),
                ('address1', models.CharField(blank=True, max_length=100, null=True)),
                ('address2', models.CharField(blank=True, max_length=100, null=True)),
                ('city', models.CharField(blank=True, max_length=100, null=True)),
                ('state', models.CharField(blank=True, max_length=100, null=True)),
                ('postal_code', models.IntegerField(blank=True, null=True)),
                ('country', models.CharField(blank=True, max_length=100, null=True)),
                ('phone', models.CharField(blank=True, max_length=10, null=True)),
                ('salutation', models.CharField(blank=True, max_length=100, null=True)),
                ('credit_card', models.CharField(blank=True, max_length=15, null=True)),
                ('credit_card_type_id', models.CharField(max_length=100)),
                ('mm_yy', models.CharField(blank=True, max_length=7, null=True)),
                ('billing_address', models.CharField(blank=True, max_length=250, null=True)),
                ('billing_city', models.CharField(blank=True, max_length=100, null=True)),
                ('billing_postal_code', models.CharField(blank=True, max_length=100, null=True)),
                ('billing_country', models.CharField(blank=True, max_length=100, null=True)),
                ('ship_address', models.CharField(blank=True, max_length=250, null=True)),
                ('ship_city', models.CharField(blank=True, max_length=250, null=True)),
                ('ship_region', models.CharField(blank=True, max_length=250, null=True)),
                ('ship_postal_code', models.CharField(blank=True, max_length=100, null=True)),
                ('ship_country', models.CharField(blank=True, max_length=100, null=True)),
                ('marketing_code', models.CharField(blank=True, max_length=100, null=True)),
                ('source', models.CharField(blank=True, max_length=100, null=True)),
                ('medium', models.CharField(blank=True, max_length=100, null=True)),
                ('gcustid', models.CharField(blank=True, max_length=512, null=True)),
                ('gclid', models.CharField(blank=True, max_length=1024, null=True)),
                ('fbclid', models.CharField(blank=True, max_length=1024, null=True)),
                ('date_entered', models.DateTimeField(auto_now_add=True)),
                ('terms_condition', models.BooleanField(default=True)),
                ('data_privacy', models.BooleanField(default=True)),
                ('guest_login', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='NewsletterSubscription',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('salutation', models.CharField(max_length=3)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.CharField(max_length=100)),
                ('data_acceptance', models.BooleanField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('vendor_product_id', models.CharField(blank=True, max_length=50, null=True)),
                ('product_name', models.CharField(max_length=100)),
                ('quantity', models.IntegerField(default=0)),
                ('price', models.FloatField()),
                ('msrp', models.CharField(blank=True, max_length=100, null=True)),
                ('ean', models.CharField(blank=True, max_length=255, null=True)),
                ('title', models.CharField(max_length=1024)),
                ('title_de', models.CharField(blank=True, max_length=1024, null=True)),
                ('size', models.CharField(blank=True, max_length=100, null=True)),
                ('color', models.CharField(blank=True, max_length=100, null=True)),
                ('discount', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Discount %')),
                ('product_available', models.BooleanField(default=False)),
                ('picture', models.URLField(blank=True, null=True)),
                ('ranking', models.CharField(blank=True, choices=[('promoted', 'Promoted'), ('best_seller', 'Best Seller')], max_length=15, null=True)),
                ('description', models.TextField(blank=True, max_length=200, null=True)),
                ('description_de', models.TextField(blank=True, max_length=200, null=True)),
                ('product_highlight', models.TextField(blank=True, max_length=200, null=True)),
                ('product_highlight_de', models.TextField(blank=True, max_length=200, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='odata.Categories')),
            ],
        ),
        migrations.CreateModel(
            name='UserForgotPassword',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('token', models.CharField(max_length=10)),
                ('is_consumed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='reset_password_user', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ProductVariant',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('size', models.CharField(max_length=100)),
                ('color', models.CharField(max_length=100)),
                ('material', models.CharField(max_length=100)),
                ('image', models.URLField(blank=True, null=True)),
                ('parent_product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='odata.Product')),
            ],
        ),
        migrations.CreateModel(
            name='ProductImage',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('image_order', models.IntegerField()),
                ('image', models.URLField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='odata.Product')),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('order', models.CharField(max_length=100)),
                ('invoice', models.CharField(max_length=100)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=19)),
                ('payment_type', models.CharField(max_length=50)),
                ('status', models.CharField(max_length=15)),
                ('date_of_payment', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='odata.Customer')),
            ],
        ),
    ]
