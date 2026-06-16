-- Entertainment, Sports, Business category pages
insert into public.categories (slug, title, title_ml, nav_label, description, sort_order)
values
  (
    'entertainment',
    'Entertainment',
    'വിനോദം',
    'ENTERTAINMENT',
    'വിനോദ ലോകത്തെ വാർത്തകളും അപ്ഡേറ്റുകളും',
    4
  ),
  (
    'sports',
    'Sports',
    'കായികം',
    'SPORTS',
    'കായിക വാർത്തകളും റിപ്പോർട്ടുകളും',
    5
  ),
  (
    'business',
    'Business',
    'ബിസിനസ്',
    'BUSINESS',
    'ബിസിനസ് വാർത്തകളും സാമ്പത്തിക അപ്ഡേറ്റുകളും',
    6
  )
on conflict (slug) do nothing;
